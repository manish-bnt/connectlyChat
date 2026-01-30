const cloudinary = require("../cloudinary");
const User = require('../models/user')

async function uploadProfile(req, res) {
  try {
    // demo account check
    if (req.user.isDemo === true) {
      return res.status(403).json({
        msg: "Profile modifications are disabled for demo accounts.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded!" });
    }

    const userId = req.user._id;
    console.log("userId: ", userId)

    // upload image to Cloudinary

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "profiles" }
    );

    console.log("secure_url:  ", result)
    // const imageUrl = result.secure_url;


    // console.log("imageUrl: ", imageUrl)
    // save image URL in DB
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profile: {
          url: result.secure_url,
          public_id: result.public_id
        }
      },
      { new: true }
    );



    res.status(200).json({
      msg: "Profile updated!",
      user,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}


async function deleteProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user.profile?.public_id) {
      return res.status(400).json({ msg: "No profile image to delete" });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(user.profile.public_id);

    // update DB
    user.profile = null;
    await user.save();

    res.status(200).json({ msg: "Profile image deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}


module.exports = { uploadProfile, deleteProfile };
