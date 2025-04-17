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

// GET specific course by courseCode
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const course: ICourse | null = await Course.findOne({courseCode: req.params.code});
    if (course) {
      res.json(course);
    }
    else {
      res.status(404)
    }
    
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit specific course by courseCode
router.put('/:code', async (req: Request, res: Response) => {
  try {
    const course: ICourse | null = await Course.findOneAndUpdate({courseCode: req.params.code}, req.body);
    if (course) {
      res.json(course);
    }
    else {
      res.status(404)
    }
    
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

// DELETE specific course by courseCode
router.delete('/:code', async (req: Request, res: Response) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({courseCode: req.params.code});
    if (deletedCourse) {
      res.json(deletedCourse);
    }
    else {
      res.status(404)
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

