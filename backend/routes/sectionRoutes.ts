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

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const section: ISection | null = await Section.findByIdAndUpdate(
      req.params.id
    , req.body);
    if (section) {
      res.json(section);
    }
    else {
      res.status(404)
    }
    
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE specific course by courseCode
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(
      req.params.id
    );
    if (deletedSection) {
      res.json(deletedSection);
    }
    else {
      res.status(404)
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

