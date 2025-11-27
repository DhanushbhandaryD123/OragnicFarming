// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    isEmailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date },
    wishlist:       [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Product' }],
savedForLater:  [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Product' }],


    // compact OTP data
    emailVerification: {
      otpHash: { type: String },
      expiresAt: { type: Date },
      attempts: { type: Number, default: 0 },  // track invalid tries
      maxAttempts: { type: Number, default: 5 } // simple brute-force cap
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
