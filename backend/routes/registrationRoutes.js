const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// GET all registrations
router.get('/', async (req, res) => {
  try {
    const regs = await Registration.find().populate('studentId').populate('sectionId');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new registration
router.post('/', async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    const saved = await newReg.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
