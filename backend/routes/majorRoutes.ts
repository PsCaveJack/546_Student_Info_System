import express, { Request, Response } from 'express';
import Major, { IMajor } from '../models/Major';

const router = express.Router();

// GET all majors
router.get('/', async (req: Request, res: Response) => {
  try {
    const majors: IMajor[] = await Major.find();
    res.json(majors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new major
router.post('/', async (req: Request, res: Response) => {
  try {
    const newMajor = new Major(req.body);
    const saved = await newMajor.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

