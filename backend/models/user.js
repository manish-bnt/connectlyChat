const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    required: true
  },

  profile: {
    url: {
      type: String,
      default: null
    },
    public_id: {
      type: String,
      default: null
    }
  },

  isDemo: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  deletedAt: {
    type: Date,
    default: null
  },

  // expiresAt: {
  //   type: Date,
  //   default: () => Date.now() + 2 * 60 * 60 * 1000,
  //   expires: 0
  // }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)

