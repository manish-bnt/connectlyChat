const Conversation = require("../models/conversation");
const Message = require("../models/message");
const Contact = require('../models/contact');
const User = require("../models/user");

//=======================  Send a message to a friend ==============================//
async function sendMessages(req, res) {

  // Delay for demo auto-reply (2.5 seconds)
  const DEMO_REPLY_DELAY = 2500; // 2.5 sec

  // Fixed demo replies (sent one by one)
  const DEMO_REPLIES = [
    "Hi 👋",
    "Hello 🙂",
    "How are you?",
    "Nice to meet you!",
    "This is a demo chat.",
    "You can freely test the messaging feature.",
    "Everything works like a real chat app 👍"
  ];


  try {
    const { receiverId, text, demoSessionId } = req.body;
    const senderId = req.user._id; // logged-in user id

    // Empty message validation
    if (!text || !text.trim()) {
      return res.status(400).json({
        msg: "Message text cannot be empty"
      });
    }


    // Build conversation query
    let conversationQuery = {
      participants: { $all: [senderId, receiverId] }
    };

    // For demo users, conversation is session-based
    if (req.user.isDemo) {
      conversationQuery.demoSessionId = demoSessionId;
    }

    // Find existing conversation
    let conversation = await Conversation.findOne(conversationQuery);

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        demoSessionId: req.user.isDemo ? demoSessionId : null
      });
    }

    // Get sender details (used for auto-contact creation)
    const sender = await User.findById(senderId).select("username mobile isDemo");
    // console.log("senderf ", sender)
    if (!sender) return res.status(404).json({ msg: "Sender not found" });

    const io = req.app.get("io"); // get socket.io instance
    let restoredContact = null;

    // Demo users must have a session id
    if (req.user.isDemo && !demoSessionId) {
      return res.status(400).json({
        msg: "demoSessionId is required for demo users"
      });
    }

    // Auto-create or restore contact (only for real users)
    if (!sender.isDemo) {

      // Check if the friend already has me as a contact
      const existingContact = await Contact.findOne({ owner: receiverId, linkedUser: senderId });

      // If not, create it automatically
      if (!existingContact) {
        restoredContact = await Contact.create({
          owner: receiverId,
          linkedUser: senderId,
          name: sender.username,
          mobile: sender.mobile,
          isAutoCreated: true,
          isDeleted: false
        });
      }
      // Restore contact if it was deleted
      else if (existingContact.isDeleted) {
        restoredContact = await Contact.findByIdAndUpdate(
          existingContact._id,
          { isDeleted: false, deletedAt: null, isAutoCreated: true },
          { new: true }
        );
      }

      // Notify receiver if contact was created/restored
      if (restoredContact) {
        const restoredContactFull = await Contact.findById(restoredContact._id)
          .populate("linkedUser");
        // const restoredContactFull = await Contact.findById(restoredContact._id)
        //   .populate("linkedUser", "username mobile");

        io.to(receiverId.toString()).emit("contactRestored", restoredContactFull);
      }

    }

    // Create the message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    // Update last message in conversation
    conversation.lastMessage = newMessage._id;

    // Save both message and conversation
    await Promise.all([conversation.save(), newMessage.save()]);

    // ---------------- DEMO AUTO REPLY ----------------

    if (req.user.isDemo) {

      const demoPerson = await User.findOne({ email: "madhav@gmail.com" });
      if (!demoPerson) return;

      setTimeout(async () => {
        try {
          // Find or create demo conversation
          let demoConversation = await Conversation.findOne({
            participants: { $all: [senderId, demoPerson._id] },
            demoSessionId
          });

          if (!demoConversation) {
            demoConversation = await Conversation.create({
              participants: [senderId, demoPerson._id],
              demoSessionId,
              demoReplyIndex: 0
            });
          }

          // Read current reply index
          let index = demoConversation.demoReplyIndex || 0;


          // Stop if all replies are sent and again start from 0 index.
          if (index >= DEMO_REPLIES.length) {
            demoConversation.demoReplyIndex = 0;
            await demoConversation.save();
            return;
          }
          const replyText = DEMO_REPLIES[index];

          // Create demo reply message
          const demoReply = await Message.create({
            conversationId: demoConversation._id,
            sender: demoPerson._id,
            receiver: senderId,
            text: replyText
          });

          // Update conversation
          demoConversation.lastMessage = demoReply._id;
          demoConversation.demoReplyIndex = index + 1;
          await demoConversation.save();


          // Emit demo reply via socket
          const io = req.app.get("io");
          io.to(demoSessionId).emit("chatMessage", {
            _id: demoReply._id,
            sender: demoPerson._id,
            receiver: senderId,
            text: demoReply.text,
            createdAt: demoReply.createdAt
          });
        } catch (err) {
          console.error("Demo auto-reply error:", err.message);
        }
      }, DEMO_REPLY_DELAY);
    }

    // Populate sender info before sending response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "_id username");

    // Send message to receiver via socket
    io.to(receiverId.toString()).emit("chatMessage", {
      _id: populatedMessage._id,
      sender: populatedMessage.sender,
      receiver: receiverId,
      text: populatedMessage.text,
      createdAt: populatedMessage.createdAt
    });

    io.to(receiverId).emit('chatMessage', {
      _id: newMessage._id,
      sender: senderId,
      receiver: receiverId,
      text: newMessage.text,
      createdAt: newMessage.createdAt
    });

    res.status(201).json({ success: true, data: populatedMessage });


  } catch (error) {
    console.error("Something went wrong while sending message:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}


//======================= Get all messages between two users ==============================//
async function getMessages(req, res) {
  try {
    const { userToChatId } = req.params;
    const senderId = req.user._id;

    // Find the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    });

    // If no conversation, return empty array
    if (!conversation) return res.status(200).json({ success: true, data: [] });

    // Fetch messages not deleted by this user
    const messages = await Message.find({
      conversationId: conversation._id,
      deletedBy: { $ne: senderId }
    }).populate("sender").sort({ createdAt: 1 }); // oldest first

    res.status(200).json({ success: true, data: messages });

  } catch (error) {
    console.error("Error getting messages:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}


//======================= Clear chat with a friend (only for me, doesn't delete messages for them) ==============================//

async function clearChats(req, res) {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    // Mark messages as deleted for this user only
    const result = await Message.updateMany(
      {
        $or: [
          { sender: userId, receiver: friendId },
          { sender: friendId, receiver: userId }
        ]
      },
      { $addToSet: { deletedBy: userId } }
    );

    return res.status(200).json({
      success: true,
      msg: `Chats cleared!`
    });

  } catch (error) {
    console.error("Error clearing chats:", error.message);
    return res.status(500).json({ success: false, msg: error.message });
  }
}

module.exports = { sendMessages, getMessages, clearChats };
