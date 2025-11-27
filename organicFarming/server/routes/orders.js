const express = require('express');
const Stripe = require('stripe');
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('../utils/smsSender'); // ✅ import SMS sender
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

/** 
 * 1) Create Stripe Checkout Session & save Order 
 *    POST /api/orders/checkout
 */
router.post('/checkout', async (req, res) => {
  try {
    const { cart, customerName, customerContact, address, userEmail } = req.body;

    // build line items
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/my-orders`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    // save order in draft state
    const order = await Order.create({
      userEmail,
      products: cart,
      total: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      customerName,
      customerContact,
      address,
      paymentMethod: 'card',
      stripeSessionId: session.id,
      status: 'Pending',
    });

    // ✅ send confirmation SMS
    try {
      const productSummary = cart.map(p => `${p.name} (x${p.quantity})`).join(', ');
      await sendOrderConfirmation(customerContact, order._id.toString(), productSummary, '3-5 business days');
    } catch (smsErr) {
      console.error('⚠️ SMS not sent:', smsErr.message);
    }

    res.json({ id: session.id });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout initiation failed.' });
  }
});

/** 
 * 2) Place Cash-on-Delivery order 
 *    POST /api/orders/place
 */
router.post('/place', async (req, res) => {
  try {
    const { cart, customerName, customerContact, address, userEmail } = req.body;

    const order = await Order.create({
      userEmail,
      products: cart,
      total: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      customerName,
      customerContact,
      address,
      paymentMethod: 'cod',
      status: 'Pending',
    });

    // ✅ send SMS confirmation after COD order
    try {
      const productSummary = cart.map(p => `${p.name} (x${p.quantity})`).join(', ');
      await sendOrderConfirmation(customerContact, order._id.toString(), productSummary, '3-5 business days');
    } catch (smsErr) {
      console.error('⚠️ SMS not sent:', smsErr.message);
    }

    res.json({ order });
  } catch (err) {
    console.error('COD error:', err);
    res.status(500).json({ error: 'Cash-on-Delivery order failed.' });
  }
});

/** 
 * 3) List ALL orders (for Admin)
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

/** 
 * 4) List a single user’s orders 
 */
router.get('/user', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Missing email parameter' });

    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch user orders error:', err);
    res.status(500).json({ error: 'Could not fetch user orders' });
  }
});

/** 
 * 5) Update an order’s status (Admin)
 */
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Failed to update order:', err);
    res.status(500).json({ error: 'Could not update status' });
  }
});

/** 
 * 6) Track a single order 
 */
router.get('/:id/track', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select(
      'status tracking courier lastLocation createdAt customerName address'
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Track fetch error:', err);
    res.status(500).json({ error: 'Could not fetch tracking info' });
  }
});

/** 
 * 7) Append status note to tracking
 */
router.patch('/:id/status-append', async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    order.tracking.push({ status, note });
    await order.save();

    res.json({
      message: 'Status updated',
      status: order.status,
      lastEvent: order.tracking.at(-1),
    });
  } catch (err) {
    console.error('Status append error:', err);
    res.status(500).json({ error: 'Could not update status' });
  }
});

/** 
 * 8) Update order live location 
 */
router.patch('/:id/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'lat and lng must be numbers' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          lastLocation: { type: 'Point', coordinates: [lng, lat], updatedAt: new Date() },
        },
      },
      { new: true, projection: { lastLocation: 1 } }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Location updated', lastLocation: order.lastLocation });
  } catch (err) {
    console.error('Location update error:', err);
    res.status(500).json({ error: 'Could not update location' });
  }
});

module.exports = router;
