const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// GET all sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new section
router.post('/', async (req, res) => {
  try {
    const newSection = new Section(req.body);
    const saved = await newSection.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
