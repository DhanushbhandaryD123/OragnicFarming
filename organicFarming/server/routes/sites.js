const express = require("express");
const multer = require("multer");
const path = require("path");
const Site = require("../models/Site");
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ➕ Add new site
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { owner, contact, address, district, size, price, status } = req.body;
    const newSite = new Site({
      owner, contact, address, district, size, price, status,
      image: req.file ? req.file.filename : null
    });
    await newSite.save();
    res.json(newSite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add site" });
  }
});

// 📋 Get all sites
router.get("/all", async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sites" });
  }
});

// ✏️ Update site
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.image = req.file.filename;
    const updatedSite = await Site.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedSite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update site" });
  }
});

// ❌ Delete site
router.delete("/:id", async (req, res) => {
  try {
    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: "Site deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete site" });
  }
});

// ✅ Track contact clicks
router.post("/track-contact", async (req, res) => {
  const { siteId, type, user } = req.body;
  if (!siteId || !type) return res.status(400).json({ error: "siteId and type required" });

  try {
    const site = await Site.findById(siteId);
    if (!site) return res.status(404).json({ error: "Site not found" });

    site.contacts.push({ type, date: new Date(), user: user || "Guest" });
    await site.save();
    res.json({ message: "Contact tracked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to track contact" });
  }
});

// ✅ Get all contact interactions
router.get("/contacts", async (req, res) => {
  try {
    const sites = await Site.find().select("owner contact address district contacts");
    res.json(sites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contact interactions" });
  }
});

module.exports = router;
