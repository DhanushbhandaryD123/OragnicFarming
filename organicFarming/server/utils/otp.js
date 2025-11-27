// server/utils/otp.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const OTP_LENGTH = 4;           // <-- 4 digits
const OTP_TTL_MINUTES = 10;     // expires in 10 minutes
const SALT_ROUNDS = 10;

function generateNumericOTP(len = OTP_LENGTH) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < len; i++) {
    const idx = crypto.randomInt(0, digits.length);
    otp += digits[idx];
  }
  return otp;
}

async function hashOtp(otp) {
  return bcrypt.hash(otp, SALT_ROUNDS);
}

function calcExpiry(minutes = OTP_TTL_MINUTES) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

module.exports = { generateNumericOTP, hashOtp, calcExpiry };
