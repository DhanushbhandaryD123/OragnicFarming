// server/models/Order.js
const mongoose = require('mongoose');

const productSubSchema = new mongoose.Schema({
  _id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  note:   { type: String },
  at:     { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userEmail:       { type: String, required: true },
  products:        { type: [productSubSchema], required: true },
  total:           { type: Number, required: true },
  customerName:    { type: String, required: true },
  customerContact: { type: String, required: true },
  address:         { type: String, required: true },
  paymentMethod:   { type: String, enum: ['card','cod'], required: true },
  stripeSessionId: {
    type: String,
    required: function () { return this.paymentMethod === 'card'; }
  },
  status:    { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },

  // --- tracking fields (no defaults that create half-filled docs) ---
  tracking: { type: [trackingEventSchema], default: [] },
  courier:  {
    name:  String,
    phone: String
  },
  lastLocation: {
    type: {
      type: String,
      enum: ['Point']
      // NOTE: no default here
    },
    coordinates: {
      type: [Number] // [lng, lat]
      // NOTE: no default here
    },
    updatedAt: Date
  }
});

orderSchema.index({ userEmail: 1, createdAt: -1 });
orderSchema.index({ lastLocation: '2dsphere' }); // ok when field is missing

module.exports = mongoose.model('Order', orderSchema);
