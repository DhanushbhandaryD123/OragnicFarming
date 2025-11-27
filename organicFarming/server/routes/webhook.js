const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Order = require("../models/Order");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// webhook endpoint
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.status = "Confirmed";
        order.tracking.push({ status: "Confirmed", note: "Payment received via Stripe" });
        await order.save();

        // optionally: send email or SMS here
        console.log("✅ Order confirmed:", order._id);
      }
    } catch (err) {
      console.error("Failed to update order after payment:", err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
