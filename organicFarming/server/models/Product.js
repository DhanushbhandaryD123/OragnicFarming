// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        String,
  price:       Number,
  category:    String,
  description: String,
  available:   Boolean,
  imageUrl:    String,

  // NEW:
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmerProfile',
    default: null
  },
  farmerName: { type: String } // snapshot for quick reads / fallback
});

module.exports = mongoose.model('Product', productSchema);
