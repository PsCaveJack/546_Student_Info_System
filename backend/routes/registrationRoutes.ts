import express, { Request, Response } from 'express';
import Registration, { IRegistration } from '../models/Registration';

const router = express.Router();

// GET all registrations
router.get('/', async (req: Request, res: Response) => {
  try {
    const regs: IRegistration[] = await Registration.find()
      .populate('studentId')
      .populate('sectionId');
    res.json(regs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new registration
router.post('/', async (req: Request, res: Response) => {
  try {
    const newReg = new Registration(req.body);
    const saved = await newReg.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

