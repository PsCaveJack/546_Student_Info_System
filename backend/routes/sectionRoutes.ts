import express, { Request, Response } from 'express';
import Section, { ISection } from '../models/Section';

const router = express.Router();

// GET all sections
router.get('/', async (req: Request, res: Response) => {
  try {
    const sections: ISection[] = await Section.find();
    res.json(sections);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new section
router.post('/', async (req: Request, res: Response) => {
  try {
    const newSection = new Section(req.body);
    const saved = await newSection.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

