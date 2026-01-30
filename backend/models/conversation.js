const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({

  // Array of 2 Users: [UserA_ID, UserB_ID]

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],


  // Store the last message like whatsapp

  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },

  demoSessionId: {
    type: String,
    default: null
  },

  demoReplyIndex: {
    type: Number,
    default: 0,
  }

}, { timestamps: true })

// Conversation should not be created twice for the same pair

conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema)