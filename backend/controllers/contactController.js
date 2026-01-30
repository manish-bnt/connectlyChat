const Contact = require("../models/contact");
const User = require("../models/user");
const Message = require('../models/message');

// Add a new contact
async function addContact(req, res) {
  try {
    const { name, email, mobile, address } = req.body;
    const ownerId = req.user._id;

    // Disable add contact feature for demo users
    if (req.user.isDemo) {
      return res.status(403).json({
        msg: "This action is not available in demo mode."
      })
    }

    // Check if this mobile number belongs to a registered user
    const existingUser = await User.findOne({ mobile: mobile });
    console.log("existinguser ", existingUser)
    if (!existingUser) return res.status(404).json({ msg: 'This user is not available on ConnectlyApp' });

    // Prevent adding yourself as a contact
    if (existingUser._id.toString() === ownerId.toString()) {
      return res.status(400).json({ msg: "You cannot add your own number as a contact" });
    }

    // Check if contact already exists for this user
    let existingContact = await Contact.findOne({ owner: ownerId, mobile: mobile });

    if (existingContact) {
      if (existingContact.isDeleted) {
        // Restore contact if it was soft deleted
        existingContact.isDeleted = false;
        existingContact.deletedAt = null;

        const restored = await existingContact.save();

        //populate the restore contact for getting full info.
        // const populatedContact = await Contact.findById(restored._id).populate("linkedUser");
        // console.log("populatedContact: ", populatedContact)
        const populatedContact = await Contact.findById(restored._id).populate("linkedUser", "username mobile profile");
        return res.status(200).json({ success: true, msg: 'Contact restored successfully!', data: populatedContact });
      } else {
        return res.status(400).json({ msg: 'This mobile number is already in your contacts.' });
      }
    }

    // Create new contact. If the user exists, link to their _id
    const newContact = new Contact({
      owner: ownerId,
      name, email, mobile, address,
      linkedUser: existingUser._id
    });

    const savedContact = await newContact.save();

    if (savedContact) {
      return res.status(201).json({ success: true, msg: 'Contact added successfully!', data: savedContact });
    } else {
      return res.status(400).json({ msg: 'Failed to add contact' });
    }

  } catch (error) {
    console.error("Add Contact Error: ", error.message);

    // Handle duplicate mobile number error (if schema has unique index)
    if (error.code === 11000) {
      return res.status(400).json({ msg: 'This mobile number is already in your contacts.' });
    }

    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

// Get all contacts for logged-in user
async function getContacts(req, res) {
  try {
    const ownerId = req.user._id;

    // Fetch all active contacts
    let contacts = await Contact.find({ owner: ownerId, isDeleted: false })
      .sort({ name: 1 })
      .populate('linkedUser');

    // Demo user: auto add demo contact
    if (req.user.isDemo) {
      const defaultPerson = await User.findOne({ email: "madhav@gmail.com" });

      if (defaultPerson) {
        let demoContact = await Contact.findOne({
          owner: ownerId,
          linkedUser: defaultPerson._id
        }).populate('linkedUser')

        // Create demo contact if not exists
        if (!demoContact) {
          demoContact = await Contact.create({
            owner: ownerId,
            name: defaultPerson.username,
            mobile: defaultPerson.mobile || "0000000000", // required field
            linkedUser: defaultPerson._id,
            isAutoCreated: true
          });
        }

        // Keep demo contact at top
        contacts = [demoContact, ...contacts.filter(c => c._id.toString() !== demoContact._id.toString())];
        console.log("contacts: ", contacts)
      }
    }

    return res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Failed to fetch contacts: ', error.message);
    return res.status(500).json({ msg: 'Failed to fetch contacts' });
  }
}

// Update an existing contact

async function updateContact(req, res) {
  try {
    const { id } = req.params;
    const { name, mobile, email, address } = req.body;
    const userId = req.user;

    const user = await User.findById(userId)

    if (user.isDemo=== true) return res.status(404).json({ msg: 'Contact modifications are disabled for demo accounts.' })
    
    // Update contact only if it belongs to logged-in user
    const userContact = await Contact.findByIdAndUpdate(
      { _id: id, owner: userId },
      { $set: { name, mobile, email, address } },
      { new: true }
    ).populate("linkedUser"); // include linked user info


    if (!userContact) return res.status(401).json({ msg: "User not found!" });

    // console.log("Updated contact: ", userContact);
    return res.status(200).json({ msg: 'Updated successfully!', data: userContact });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: error.message });
  }
}

// Delete a contact (soft delete)

async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (user.isDemo === true) return res.status(404).json({ msg: "Delete account is disabled for demo users." })

    // Soft delete contact
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: { isDeleted: true, isAutoCreated: false, deletedAt: new Date() } },
      { new: true }
    );

    if (!contact) return res.status(404).json({ msg: 'Contact not found!' });

    const friendId = contact.linkedUser._id || contact.linkedUser;

    // Hide all messages with this contact for current user
    await Message.updateMany(
      {
        $or: [
          { sender: userId, receiver: friendId },
          { sender: friendId, receiver: userId }
        ]
      },
      { $addToSet: { deletedBy: userId } } // only for logged-in user
    );

    // Return updated contacts list
    const updatedContacts = await Contact.find({ owner: userId, isDeleted: false });
    return res.status(200).json({ msg: 'Contact deleted successfully!', data: updatedContacts });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: error.message });
  }
}

module.exports = { addContact, getContacts, updateContact, deleteContact };



