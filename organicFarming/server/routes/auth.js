// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/mailer');
const { generateNumericOTP, hashOtp, calcExpiry } = require('../utils/otp');


const authRoutes = express.Router();

// POST /api/auth/signup
authRoutes.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const byEmail = await User.findOne({ email });
    const byUsername = await User.findOne({ username });

    // If email exists and is unverified → regenerate OTP (no separate resend route)
    if (byEmail && !byEmail.isEmailVerified) {
      const rawOtp = generateNumericOTP(4);
      byEmail.emailVerification = {
        otpHash: await hashOtp(rawOtp),
        expiresAt: calcExpiry(10),
        attempts: 0,
        maxAttempts: 5
      };
      await byEmail.save();

      await sendOtpEmail({ to: byEmail.email, otp: rawOtp, username: byEmail.username });

      return res.status(200).json({
        message: 'Account exists but is not verified. A new verification code was sent to your email.',
        user: { id: byEmail._id, username: byEmail.username, email: byEmail.email, isEmailVerified: byEmail.isEmailVerified }
      });
    }

    // Hard conflicts
    if (byEmail && byEmail.isEmailVerified) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    if (byUsername && (!byEmail || String(byUsername._id) !== String(byEmail?._id))) {
      return res.status(409).json({ message: 'Username already in use.' });
    }

    // Create fresh user (unverified) + send OTP
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      isEmailVerified: false
    });

    const rawOtp = generateNumericOTP(4);
    user.emailVerification = {
      otpHash: await hashOtp(rawOtp),
      expiresAt: calcExpiry(10),
      attempts: 0,
      maxAttempts: 5
    };
    await user.save();

    await sendOtpEmail({ to: user.email, otp: rawOtp, username: user.username });

    return res.status(201).json({
      message: 'User created. A 4‑digit verification code was sent to your email.',
      user: { id: user._id, username: user.username, email: user.email, isEmailVerified: user.isEmailVerified }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


authRoutes.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isEmailVerified) {
      return res.status(200).json({ message: 'Email already verified.' });
    }

    const data = user.emailVerification || {};
    if (!data.otpHash || !data.expiresAt) {
      return res.status(400).json({ message: 'No active verification code. Run signup again.' });
    }

    if (new Date() > new Date(data.expiresAt)) {
      return res.status(400).json({ message: 'Code expired. Run signup again to receive a new code.' });
    }

    if (data.attempts >= (data.maxAttempts || 5)) {
      return res.status(429).json({ message: 'Too many attempts. Run signup again.' });
    }

    const ok = await bcrypt.compare(otp, data.otpHash);
    if (!ok) {
      user.emailVerification.attempts = (data.attempts || 0) + 1;
      await user.save();
      return res.status(401).json({ message: 'Invalid code.' });
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerification = undefined;
    await user.save();

    return res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


authRoutes.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please check your email for the 4‑digit code.' });
    }

    // issue JWT here if needed
    return res.json({
      message: 'Signin successful',
      user: { id: user._id, username: user.username, email: user.email, isEmailVerified: user.isEmailVerified }
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = authRoutes;
