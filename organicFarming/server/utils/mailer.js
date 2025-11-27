// server/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// optional: verify connection at startup
transporter.verify().then(() => console.log('SMTP ready')).catch(console.error);

async function sendOtpEmail({ to, otp, username }) {
  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Email Verification</h2>
      <p>Hi ${username},</p>
      <p>Your verification code is:</p>
      <div style="font-size:28px;font-weight:bold;letter-spacing:6px">${otp}</div>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;
  await transporter.sendMail({
    from: `"Organic Farming" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your 4‑digit verification code',
    html
  });
}

module.exports = { sendOtpEmail };
