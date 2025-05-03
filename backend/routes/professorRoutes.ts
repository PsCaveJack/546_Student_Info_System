import express, { Request, RequestHandler, Response } from 'express';
import User from '../models/User';
import Registration from '../models/Registration';
import Section, { ISection } from '../models/Section';
import Course from '../models/Course';

const router = express.Router();

router.get(
  '/:professorId/students',
  (async (req: Request, res: Response) => {
    try {
      const { professorId } = req.params;
      console.log('===== PROFESSOR STUDENTS DEBUG =====');
      console.log('Professor ID:', professorId);
    
      // Find professor
      const professor = await User.findById(professorId);
      console.log('Professor found:', professor ? professor.firstName + ' ' + professor.lastName : 'None');
      console.log('Professor username:', professor ? professor.username : 'N/A');
      
      if (!professor || professor.role !== 'professor') {
        return res.status(404).json({ error: 'Professor not found' });
      }

      // Get all sections taught by this professor using both username and full name
      const sections = await Section.find({ 
        $or: [
          { instructor: professor.username },
          { instructor: professor.firstName + ' ' + professor.lastName }
        ]
      }).exec();
      
      console.log('Sections found:', sections.length);
      console.log('Section IDs:', sections.map(s => s._id));
      
      const sectionIds = sections.map(section => section._id);
      
      // Find students enrolled in these sections
      const enrollments = await Registration.find({
        sectionId: { $in: sectionIds },
        status: 'enrolled'
      })
      .populate('studentId', 'firstName lastName email major');

      console.log('Raw enrollments before populate:', enrollments.length);
      
      if (enrollments.length > 0) {
        console.log('Enrollment sample:', {
          _id: enrollments[0]._id,
          studentId: enrollments[0].studentId,
          sectionId: enrollments[0].sectionId,
          status: enrollments[0].status
        });
      }

      // Format student data
      const studentData = enrollments.reduce((acc: any[], enrollment: any) => {
        console.log('Processing enrollment:', enrollment);
        const student = enrollment.studentId;
        
        // Check if student is actually populated
        if (!student || !student.firstName) {
          console.error('Student not properly populated:', student);
          return acc;
        }
        
        if (!acc.find(s => s._id.equals(student._id))) {
          acc.push({
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            major: student.major,
            enrolledCourses: []
          });
        }
        
        const studentIndex = acc.findIndex(s => s._id.equals(student._id));
        const section = sections.find(s => s._id!.toString() === enrollment.sectionId.toString());
        if (section) {
          acc[studentIndex].enrolledCourses.push({
            sectionId: section._id,
            courseCode: section.courseCode,
            section: section.section,
            semester: section.semester
          });
        }
        
        return acc;
      }, []);

      console.log('Student data to return:', studentData);
      res.json(studentData);
    } catch (error: any) {
      console.error('Error in route:', error);
      res.status(500).json({ error: error.message });
    }
  }) as RequestHandler
);

// Keep the history route unchanged for now...
router.get(
  '/:professorId/student/:studentId/history',
  (async (req: Request, res: Response) => {
    // ... existing code ...
  }) as RequestHandler
);

export default router;