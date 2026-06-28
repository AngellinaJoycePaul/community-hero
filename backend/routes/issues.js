const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Issue = require('../models/Issue');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, severity, lat, lng, address, reportedBy, aiAnalysis } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const issue = new Issue({
      title, description, category, severity,
      location: { lat: parseFloat(lat), lng: parseFloat(lng), address },
      imageUrl, reportedBy, aiAnalysis
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error('POST /issues error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/upvote', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;