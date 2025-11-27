const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  status: { type: String, default: "available" },

  // Track contact interactions
  contacts: [
    {
      type: { type: String, enum: ["call", "whatsapp"], required: true },
      date: { type: Date, default: Date.now },
      user: { type: String, default: "Guest" },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Site", siteSchema);
