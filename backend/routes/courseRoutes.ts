import express, { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';

const router = express.Router();

// GET all courses
router.get('/', async (req: Request, res: Response) => {
  try {
    const courses: ICourse[] = await Course.find();
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new course
router.post('/', async (req: Request, res: Response) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

