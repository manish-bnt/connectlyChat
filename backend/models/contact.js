const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({

  // The user (owner) who saved the contact 
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 2. contact details enterd by the logged-user
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String, required: true },
  address: { type: String },
  isAutoCreated: { type: Boolean, default: false },


  // If the person is already on your app
  linkedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  deletedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// The same user cannot save the same person twice (unique link)
contactSchema.index({ owner: 1, mobile: 1 }, { unique: true })

module.exports = mongoose.model('Contact', contactSchema)
