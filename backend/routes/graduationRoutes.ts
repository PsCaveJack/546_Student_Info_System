import express, { Request, Response } from "express";
import User from "../models/User";
import Major from "../models/Major";

const router = express.Router();

const gradePoints: Record<string, number> = {
  A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.0, F: 0
};

// all user/student's all data :GET /api/graduation-check/all
router.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "student" });

    const results = await Promise.all(users.map(async (user) => {
      const completedCourses: { courseCode: string; credits: number; grade: string }[] = [];
      let totalUnits = 0;
      let totalGradePoints = 0;

      if (Array.isArray(user.history)) {
        for (const record of user.history) {
          if (record.courseCode && record.credits != null && record.grade) {
            completedCourses.push({
              courseCode: record.courseCode,
              credits: record.credits,
              grade: record.grade
            });

            if (gradePoints[record.grade] !== undefined) {
              totalUnits += record.credits;
              totalGradePoints += record.credits * gradePoints[record.grade];
            }
          }
        }
      }

      const GPA = totalUnits > 0 ? parseFloat((totalGradePoints / totalUnits).toFixed(2)) : 0;
      const major = await Major.findOne({ majorName: user.major });
      const requiredCourses = major?.requiredCourses || [];
      const minGPA = major?.minGPA ?? 2.0;
      const minUnits = major?.minUnits ?? 120;
      const completedCodes = completedCourses.map(c => c.courseCode);
      const missingCourses = requiredCourses.filter(code => !completedCodes.includes(code));
      const completedRequired = requiredCourses.length - missingCourses.length;
      const canBeApproved = missingCourses.length === 0 && GPA >= minGPA && totalUnits >= minUnits;
      const graduationStatus = user.graduationStatus || "Not Approved";

      return {
        student: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          gradeLevel: user.gradeLevel || "N/A",
          graduationStatus
        },
        completedCourses,
        totalUnits,
        GPA,
        minGPA,
        minUnits,
        requiredCoursesCompleted: completedRequired,
        totalRequiredCourses: requiredCourses.length,
        missingCourses,
        canBeApproved
      };
    }));

    res.json(results);
  } catch (err) {
    console.error("Graduation check error:", err);
    res.status(500).json({ error: "Failed to get graduation info." });
  }
});
//approves graducation
router.put("/status", (req: Request, res: Response): void => {
  const { email, newStatus } = req.body;

  if (!email || !newStatus) {
    res.status(400).json({ error: "Email and newStatus are required." });
    return;
  }

  const allowed = ["Approved", "Not Approved"];
  if (!allowed.includes(newStatus)) {
    res.status(400).json({ error: "Invalid status value." });
    return;
  }

  User.findOneAndUpdate(
    { email },
    { graduationStatus: newStatus },
    { new: true }
  )
    .then((updated) => {
      if (!updated) {
        res.status(404).json({ error: "Student not found." });
      } else {
        res.json({ message: "Graduation status updated.", graduationStatus: updated.graduationStatus });
      }
    })
    .catch((err) => {
      console.error("Update status error:", err);
      res.status(500).json({ error: "Failed to update graduation status." });
    });
});

export default router;
