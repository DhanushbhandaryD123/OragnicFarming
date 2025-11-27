// server/routes/products.js
const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const productRoutes = express.Router();

// ✅ configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // create this folder if not existing
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Add product with image (+ optional farmer)
productRoutes.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description, available, farmerId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // resolve farmer if provided
    let farmerRef = null;
    let farmerName = undefined;
    if (farmerId) {
      const FarmerProfile = require('../models/FarmerProfile');
      const farmer = await FarmerProfile.findById(farmerId);
      if (!farmer) return res.status(400).json({ error: 'Invalid farmerId' });
      farmerRef = farmer._id;
      farmerName = farmer.displayName;
    }

    const product = new Product({
      name,
      price: Number(price),
      category,
      description,
      available: available === 'true' || available === true,
      imageUrl,
      farmer: farmerRef,
      farmerName
    });

    await product.save();
    // populate for response
    await product.populate({ path: 'farmer', select: 'displayName location' });

    res.status(201).json(product);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ✅ List products (populate farmer)
productRoutes.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate({ path: 'farmer', select: 'displayName location' });
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ DELETE product by ID (and remove image file if exists)
productRoutes.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove the image file from uploads if it exists
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, '..', product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ✅ UPDATE product by ID (supports image replacement & farmer change)
productRoutes.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description, available, farmerId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If new image uploaded, delete old image and update URL
    if (req.file) {
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update fields
    if (name !== undefined)        product.name = name;
    if (price !== undefined)       product.price = Number(price);
    if (category !== undefined)    product.category = category;
    if (description !== undefined) product.description = description;
    if (available !== undefined)   product.available = (available === 'true' || available === true);

    // Handle farmer change
    if (farmerId !== undefined) {
      if (!farmerId) {
        product.farmer = null;
        product.farmerName = undefined;
      } else {
        const FarmerProfile = require('../models/FarmerProfile');
        const farmer = await FarmerProfile.findById(farmerId);
        if (!farmer) return res.status(400).json({ error: 'Invalid farmerId' });
        product.farmer = farmer._id;
        product.farmerName = farmer.displayName;
      }
    }

    await product.save();

    const saved = await Product.findById(product._id)
      .populate({ path: 'farmer', select: 'displayName location' });

    res.json(saved);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


module.exports = productRoutes;
