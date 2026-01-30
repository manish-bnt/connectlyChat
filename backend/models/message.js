const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  text: {
    type: String,
    required: true
  },

  deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  //Status of message

  isSeen: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// index added here
messageSchema.index({ conversationId: 1 }); // Fast find by conversation
messageSchema.index({ conversationId: 1, createdAt: 1 }); // Fast find + sort by time

module.exports = mongoose.model('Messages', messageSchema)