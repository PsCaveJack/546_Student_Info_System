import express, { Request, Response } from 'express';
import Section, { ISection } from '../models/Section';
import Course from '../models/Course';
import Registration from '../models/Registration';
import User from '../models/User';

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



//Uses sectionID to get section information
router.get('/:id/details', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    //get all the inforamtion in that specific section
    const section = await Section.findById(id).lean();
    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Get all information about this course (matching course code in Course collection)
    const course = await Course.findOne({ courseCode: section.courseCode }).lean();
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // in Registration find matching sectionID, gets student ID.
    // Get studnet name from Users with that id
    const regs = await Registration.find({ sectionId: id })
    .populate<{
      studentId: { _id: string; firstName: string; lastName: string }
    }>(
      'studentId',
      'firstName lastName'
    )
    .lean();
  
  //Everything needed
  const students = regs.map(r => ({
    registrationId: r._id,
    id:              r.studentId._id,
    firstName:       r.studentId.firstName,
    lastName:        r.studentId.lastName,
    grade:           r.grade
  }));

//return data
    res.json({
      courseCode: section.courseCode,
      courseName: course.courseName,
      students
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/sections/:id/grades
router.put('/:id/grades', async (req: Request, res: Response) => {
  try {
    const updates: { _id: string; grade: string }[] = req.body.students;

    if (updates.length == 0)
      return;

    // finding section Id -> coursecode -> units defined in course object
    // section should be the same across all registrations
    const firstRegistrationInfo = await Registration.findById(updates[0]._id).select("sectionId")

    if (!firstRegistrationInfo)
      return;

    const sectionInfo = await Section.findById(firstRegistrationInfo.sectionId).select("courseCode")

    if (!sectionInfo)
      return;

    // THEN... we can now find the amount of units this course has
    const courseInfo = await Course.findOne({courseCode: sectionInfo.courseCode}, "units");

    if (!courseInfo)
      return;

    console.log("Course for grades", courseInfo)

    await Promise.all(
      updates.map(async u => {
        const registration = await Registration.findById(u._id).select("studentId sectionId")
        
        if (!registration) 
          return;

        const studentId = registration.studentId;
        
        await Registration.findByIdAndUpdate(u._id, 
          { grade: u.grade, status: "completed" }
        )

        // update user's course history
        await User.findByIdAndUpdate(studentId, {
          $push: {
            history: {
              courseCode: sectionInfo.courseCode,
              grade: u.grade,
              units: courseInfo.units,
            }
          }
        });
      })
    );

    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update grades' });
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

