// server/utils/smsSender.js
const twilio = require('twilio');

// Initialize Twilio client using environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send Order Confirmation SMS to user
 * @param {string} phoneNumber - Recipient phone number (e.g., "+919876543210")
 * @param {string} orderId - Unique order ID
 * @param {string} productSummary - Summary of ordered items
 * @param {string} deliveryDate - Expected delivery date or text
 */
async function sendOrderConfirmation(phoneNumber, orderId, productSummary, deliveryDate) {
  if (!phoneNumber || !orderId) {
    console.error("Missing phone number or orderId for SMS.");
    return;
  }

  // Format Indian numbers if not starting with +91
  if (!phoneNumber.startsWith('+91')) {
    phoneNumber = `+91${phoneNumber}`;
  }

  const messageBody =
    `✅ Order Confirmed!\n` +
    `Order ID: ${orderId}\n` +
    `Items: ${productSummary}\n` +
    `Expected Delivery: ${deliveryDate}\n` +
    `Thank you for shopping with us!`;

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`✅ SMS sent successfully to ${phoneNumber}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("❌ Failed to send SMS:", error.message);
    throw new Error("SMS sending failed. Please check Twilio credentials or number format.");
  }
}

module.exports = { sendOrderConfirmation };
