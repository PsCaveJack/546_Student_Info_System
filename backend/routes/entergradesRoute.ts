import express, { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course';
import User from '../models/User';

const router = express.Router();


// GET /api/course-grades/:id/students
// Use course ID to to find student who has matching course ID
const getStudentsBysectionId: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const sectionId = req.params.id;

    const students = await User.find(
      { role: 'student', 'history.sectionId': sectionId },
      '_id firstName lastName history'
    );

    const formatted = students.map(s => {
      const entry = s.history?.find(h => String(h.sectionId) === sectionId);
      return {
        _id:       s._id,
        firstName: s.firstName,
        lastName:  s.lastName,
        grade:     entry?.grade || '',
      };
    });

    res.json(formatted);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
router.get('/:id/students', getStudentsBysectionId);



// GET /api/course-grades/:id/info
// Use Course ID to get other course information
const getCourseInfo: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json({
      courseCode: course.courseCode,
      courseName: course.courseName,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
router.get('/:id/info', getCourseInfo);



// PUT /api/course-grades/:id/grades
// Update grades
const updateStudentGrades: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const sectionId = req.params.id;
    const updates = req.body.students;

    await Promise.all(
      updates.map((s: { _id: string; grade: string }) =>
        User.updateOne(
          { _id: s._id, 'history.sectionId': sectionId },
          { $set: { 'history.$.grade': s.grade } }
        )
      )
    );

    res.json({ message: 'Grades updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
router.put('/:id/grades', updateStudentGrades);



// NOT USED
// GET /api/course-grades/:id/courses-taught
// Given Professor ID, go into course and find courses that has this professor ID
// This was for course-view page.  
router.get('/:id/courses-taught', async (req: Request, res: Response) => {
  try {
    const professorId = new mongoose.Types.ObjectId(req.params.id);
    const courses = await Course.find({ professorId });
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
//END OF NOT USED




export default router;
