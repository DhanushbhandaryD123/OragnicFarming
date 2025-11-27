const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

/** Helper: load user by ?userId=... (you can switch to auth later) */
async function getUser(req, res) {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).json({ message: 'userId query param is required' });
    return null;
  }
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  return user;
}

/** ===== Wishlist ===== */

// GET /api/users/me/wishlist?userId=...
router.get('/me/wishlist', async (req, res) => {
  try {
    const user = await getUser(req, res); if (!user) return;
    const populated = await user.populate({ path: 'wishlist', select: 'name price imageUrl' });
    res.json(populated.wishlist || []);
  } catch (e) {
    console.error('wishlist get error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/me/wishlist/:productId?userId=...
router.post('/me/wishlist/:productId', async (req, res) => {
  try {
    const user = await getUser(req, res); if (!user) return;
    const { productId } = req.params;
    const exists = await Product.exists({ _id: productId });
    if (!exists) return res.status(404).json({ message: 'Product not found' });

    if (!user.wishlist?.some(id => String(id) === productId)) {
      user.wishlist = [...(user.wishlist || []), productId];
      await user.save();
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('wishlist add error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/me/wishlist/:productId?userId=...
router.delete('/me/wishlist/:productId', async (req, res) => {
  try {
    const user = await getUser(req, res); if (!user) return;
    const { productId } = req.params;
    user.wishlist = (user.wishlist || []).filter(id => String(id) !== productId);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error('wishlist remove error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

/** ===== Saved for later ===== */

router.get('/me/saved', async (req, res) => {
  try {
    const user = await getUser(req, res); if (!user) return;
    const populated = await user.populate({ path: 'savedForLater', select: 'name price imageUrl' });
    res.json(populated.savedForLater || []);
  } catch (e) {
    console.error('saved get error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/me/saved/:productId', async (req, res) => {
  try {
    const user = await getUser(req, res); if (!user) return;
    const { productId } = req.params;
    const exists = await Product.exists({ _id: productId });
    if (!exists) return res.status(404).json({ message: 'Product not found' });

    if (!user.savedForLater?.some(id => String(id) === productId)) {
      user.savedForLater = [...(user.savedForLater || []), productId];
      await user.save();
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('saved add error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/me/saved/:productId', async (req, res) => {
  try {
    const user = await getUser(req, res); if (!user) return;
    const { productId } = req.params;
    user.savedForLater = (user.savedForLater || []).filter(id => String(id) !== productId);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error('saved remove error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
