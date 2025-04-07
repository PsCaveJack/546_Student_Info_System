const express = require('express');
const router = express.Router();
const Major = require('../models/Major');

// GET all majors
router.get('/', async (req, res) => {
  try {
    const majors = await Major.find();
    res.json(majors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new major
router.post('/', async (req, res) => {
  try {
    const newMajor = new Major(req.body);
    const saved = await newMajor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
