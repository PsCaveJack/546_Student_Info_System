import express, { Request, RequestHandler, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import Section from '../models/Section';
import Registration from '../models/Registration';

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
// GET students enrolled in a specific course by courseCode
router.get(
  '/:courseId/students',
  (async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;

      // Step 1: Find all sections with matching courseCode
      const sections = await Section.find({ courseCode: courseId });
      if (!sections || sections.length === 0) {
        return res.json([]); // No sections, no students
      }

      const sectionIds = sections.map(section => section._id);

      // Step 2: Find enrollments for those sections
      const enrollments = await Registration.find({
        sectionId: { $in: sectionIds },
        status: 'enrolled'
      })
        .populate('studentId', 'firstName lastName email _id')
        .populate('sectionId');
        console.log('Enrollments found:', enrollments.length);

      // Step 3: Format student data
      const studentData = enrollments.reduce((acc: any[], enrollment: any) => {
        const student = enrollment.studentId;
        if (!student || !student._id) return acc;

        const studentId = student._id.toString();
        if (!acc.find((s: any) => s._id === studentId)) {
          acc.push({
            _id: studentId,
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            fullName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown',
            grade: enrollment.grade || '-',
            registrationId: enrollment._id.toString()
          });
        }
        return acc;
      }, []);

      res.json(studentData);
    } catch (error: any) {
      console.error('Error in course students endpoint:', error);
      res.status(500).json({ error: error.message });
    }
  }) as RequestHandler
);

// // GET students enrolled in a specific course
// router.get(
//   '/:courseId/students',
//   (async (req: Request, res: Response) => {
//     try {
//       const { courseId } = req.params;
     
//       // Find the course by courseCode
//       const course = await Course.findOne({ courseCode: courseId });
//       if (!course) {
//         return res.status(404).json({ error: 'Course not found' });
//       }
     
//       // Find sections for this course using the course._id
//       // Find sections for this course using the courseCode
//       const sections = await Section.find({ courseCode: course.courseCode });
//       if (!sections || sections.length === 0) {
//         return res.json([]); // No sections, so no students
//       }
     
//       const sectionIds = sections.map(section => section._id);
     
//       // Find enrollments for these sections
//       const enrollments = await Registration.find({
//         sectionId: { $in: sectionIds },
//         status: 'enrolled'
//       })
//         .populate('studentId', 'firstName lastName email _id') // Include name fields
//         .populate('sectionId');
     
//       // Format student data ensuring we handle missing properties
//       const studentData = enrollments.reduce((acc: any[], enrollment: any) => {
//         if (!enrollment.studentId || !enrollment.studentId._id) return acc;
       
//         const student = enrollment.studentId;
//         const studentId = student._id.toString();
       
//         // Check if this student already exists in our accumulator
//         if (!acc.find((s: any) => s._id === studentId)) {
//           acc.push({
//             _id: studentId,
//             firstName: student.firstName || '',
//             lastName: student.lastName || '',
//             fullName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown',
//             grade: enrollment.grade || '-',
//             registrationId: enrollment._id.toString()
//           });
//         }
//         return acc;
//       }, []);
     
//       res.json(studentData);
//     } catch (error: any) {
//       console.error('Error in course students endpoint:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }) as RequestHandler
// );

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