// server/routes/farmers.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const FarmerProfile = require('../models/FarmerProfile');
const router = express.Router();

/* ONE multer with dynamic destination */
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let dest;
    if (file.fieldname === 'photo') {
      dest = path.join(__dirname, '..', 'uploads', 'farmers');
    } else if (file.fieldname === 'certificates') {
      dest = path.join(__dirname, '..', 'uploads', 'certs');
    } else {
      dest = path.join(__dirname, '..', 'uploads', 'misc');
    }
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({ storage });

/* ADMIN list unchanged */
router.get('/admin', async (_req, res) => {
  const all = await FarmerProfile.find().sort({ createdAt: -1 });
  res.json(all);
});

/* CREATE farmer: photo + certificates together */
router.post(
  '/admin',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'certificates', maxCount: 8 }
  ]),
  async (req, res) => {
    try {
      const { displayName, bio, location, yearsExp, specialties } = req.body;
      if (!displayName) return res.status(400).json({ message: 'displayName required' });

      const specArr = typeof specialties === 'string'
        ? specialties.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const photoFile = (req.files?.photo || [])[0];
      const certFiles = req.files?.certificates || [];

      const certs = certFiles.map(file => ({
        filename: file.filename,
        url: `/uploads/certs/${file.filename}`,
        label: file.originalname,
        uploadedAt: new Date()
      }));

      const f = await FarmerProfile.create({
        displayName,
        bio,
        location,
        yearsExp: yearsExp ? Number(yearsExp) : undefined,
        specialties: specArr,
        photoUrl: photoFile ? `/uploads/farmers/${photoFile.filename}` : undefined,
        certificates: certs,
        isVerified: false
      });

      res.status(201).json(f);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Create failed' });
    }
  }
);

/* Upload certificates later (still supported) */
router.post(
  '/admin/:id/certificates',
  upload.array('certificates', 8),
  async (req, res) => {
    const f = await FarmerProfile.findById(req.params.id);
    if (!f) return res.status(404).json({ message: 'Not found' });

    const added = (req.files || []).map(file => ({
      filename: file.filename,
      url: `/uploads/certs/${file.filename}`,
      label: file.originalname,
      uploadedAt: new Date()
    }));

    f.certificates.push(...added);
    await f.save();
    res.json(f);
  }
);

/* Delete: also remove files */
router.delete('/admin/:id', async (req, res) => {
  const f = await FarmerProfile.findByIdAndDelete(req.params.id);
  if (!f) return res.status(404).json({ message: 'Not found' });

  // remove photo
  if (f.photoUrl) {
    const abs = path.join(__dirname, '..', f.photoUrl);
    if (fs.existsSync(abs)) try { fs.unlinkSync(abs); } catch {}
  }
  // remove cert files
  if (Array.isArray(f.certificates)) {
    for (const c of f.certificates) {
      if (c?.url) {
        const abs = path.join(__dirname, '..', c.url);
        if (fs.existsSync(abs)) try { fs.unlinkSync(abs); } catch {}
      }
    }
  }
  res.json({ ok: true });
});

/* Public list/detail unchanged */
router.get('/', async (_req, res) => {
  const list = await FarmerProfile.find().select('displayName location specialties photoUrl');
  res.json(list);
});
router.get('/:id', async (req, res) => {
  const f = await FarmerProfile.findById(req.params.id);
  if (!f) return res.status(404).json({ message: 'Not found' });
  res.json(f);
});

module.exports = router;
