const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  // Field to identify the user (email)

  identifier: {
    type: String,
    required: true,
  },

  // Field to store the generated OTP
  otp: {
    type: String,
    required: true
  },

  // Field to store the OTP's creation time
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // This sets the document to expire after 300 seconds (5 minutes)
  },

})

module.exports = mongoose.model('OTP', otpSchema)