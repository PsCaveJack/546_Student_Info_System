import express, { Request, RequestHandler, Response } from 'express';
import User from '../models/User';
import Registration, { IRegistration } from '../models/Registration';
import Section from '../models/Section';
import Course from '../models/Course';


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

// Get active registrations for a student
router.get('/student/:id/enrolled', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const registrations = await Registration.find({ 
      studentId: id, 
      status: 'enrolled' 
    }).populate('sectionId');
    res.json(registrations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Drop a registration
router.put('/:id/drop', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Registration.findByIdAndUpdate(
      id,
      { status: 'dropped', dropDate: new Date() },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

//GET professors enrolled students
router.get(
  '/professor/:professorId/students',
  (async (req: Request, res: Response) => {
    try {
      const { professorId } = req.params;
      const professor = await User.findById(professorId);
      if (!professor || professor.role !== 'professor') {
        return res.status(404).json({ error: 'Professor not found' });
      }
      const sections = await Section.find({ instructor: professor.username });
      const professorSectionIds = sections.map(s => s._id);
      const enrollments = await Registration.find({
        sectionId: { $in: professorSectionIds },
        status: 'enrolled'
      })
        .populate('studentId', 'firstName lastName email major')
        .populate('sectionId');
      const studentData = enrollments.reduce((acc: any[], enrollment: any) => {
        const student = enrollment.studentId;
        if (!acc.find((s: any) => s._id.toString() === student._id.toString())) {
          acc.push({
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            major: student.major,
            enrolledCourses: []
          });
        }
        const studentIndex = acc.findIndex((s: any) => s._id.toString() === student._id.toString());
        acc[studentIndex].enrolledCourses.push({
          sectionId: enrollment.sectionId._id,
          courseCode: enrollment.sectionId.courseCode,
          courseName: '' 
        });
        return acc;
      }, []);
      res.json(studentData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }) as RequestHandler
);

// GET student's enrollment history for a specific student
router.get(
  '/professor/:professorId/student/:studentId/history',
  (async (req: Request, res: Response) => {
    try {
      const { professorId, studentId } = req.params;
      const professor = await User.findById(professorId);
      if (!professor || professor.role !== 'professor') {
        return res.status(404).json({ error: 'Professor not found' });
      }
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({ error: 'Student not found' });
      }
      const sections = await Section.find({ instructor: professor.username });
      const professorSectionIds = sections.map(s => s._id);

      const enrollmentHistory = await Registration.find({
        studentId,
        sectionId: { $in: professorSectionIds }
      })
      .populate('sectionId')
      .sort('registrationDate');

        const formattedHistory = enrollmentHistory.reduce((acc: any, enrollment: any) => {
          const semester = enrollment.sectionId.semester || 'Unknown';
          if (!acc[semester]) {
            acc[semester] = [];
          }
          acc[semester].push({
            courseCode: enrollment.sectionId.courseCode,
            courseName: '',
            grade: enrollment.grade,
            status: enrollment.status,
            credits: 0,
            registrationId: enrollment._id 
          });
          return acc;
        }, {});
      res.json({
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          major: student.major,
          GPA: student.GPA
        },
        enrollmentHistory: formattedHistory
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }) as RequestHandler
);

export default router;