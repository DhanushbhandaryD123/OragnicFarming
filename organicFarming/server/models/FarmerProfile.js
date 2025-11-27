// server/models/FarmerProfile.js
const mongoose = require('mongoose');

const certSchema = new mongoose.Schema({
  filename: String,
  url: String,
  label: String,
  uploadedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
}, { _id: true });

const farmerProfileSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  bio: String,
  location: String,
  yearsExp: Number,
  specialties: [String],
  photoUrl: String,                 // <-- photo path
  certificates: [certSchema],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
