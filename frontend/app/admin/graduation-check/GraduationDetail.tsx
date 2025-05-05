"use client";
import styles from "./styles/GraduationDetail.module.css";
import axios from "axios";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050/api";

interface CompletedCourse {
  courseCode: string;
  credits: number;
  grade: string;
}

interface GraduationResult {
  student: {
    email: string;
    name: string;
    gradeLevel: string;
    graduationStatus?: string;
  };
  completedCourses: CompletedCourse[];
  totalUnits: number;
  GPA: number;
  missingCourses: string[];
  eligible: boolean;
  minGPA: number;
  minUnits: number;
  requiredCoursesCompleted: number;
  totalRequiredCourses: number;
  canBeApproved: boolean;
}

interface Props {
  studentData: GraduationResult;
  onClose: () => void;
}

export default function GraduationDetail({ studentData, onClose }: Props) {
  const {
    student,
    GPA,
    totalUnits,
    eligible,
    missingCourses,
    completedCourses,
    minGPA,
    minUnits,
    requiredCoursesCompleted,
    totalRequiredCourses,
    canBeApproved,
  } = studentData;

  const [status, setStatus] = useState(student.graduationStatus || "Not Eligible");

  const handleApprove = async () => {
    const confirmed = window.confirm("Approve this student's graduation?");
    if (!confirmed) return;

    try {
      await axios.put(`${API_BASE}/graduation-check/status`, {
        email: student.email,
        newStatus: "Approved",
      });
      setStatus("Approved");
    } catch {
      alert("Failed to update graduation status.");
    }
  };
  
//UI
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <h3>{student.name} ({student.email})</h3>
        <p><strong>Grade Level:</strong> {student.gradeLevel}</p>

        <p>
          <strong>GPA:</strong>{" "}
          <span className={GPA >= minGPA ? styles.green : styles.red}>
            {GPA} / {minGPA}
          </span>
        </p>

        <p>
          <strong>Units:</strong>{" "}
          <span className={totalUnits >= minUnits ? styles.green : styles.red}>
            {totalUnits} / {minUnits}
          </span>
        </p>

        <p>
          <strong>Required Courses Completed:</strong>{" "}
          <span className={requiredCoursesCompleted === totalRequiredCourses ? styles.green : styles.red}>
            {requiredCoursesCompleted} / {totalRequiredCourses}
          </span>
        </p>

        <p><strong>Status:</strong></p>
        {status === "Approved" ? (
          <span className={styles.green}>Approved</span>
        ) : canBeApproved ? (
          <div className={styles.approveRow}>
            <span className={styles.waiting}>Waiting for Approval</span>
            <button className={styles.approveBtn} onClick={handleApprove}>
              Approve Graduation
            </button>
          </div>
        ) : (
          <span className={styles.red}>Not Yet Eligible</span>
        )}

        <div className={styles.divider}>
          <p><strong>Completed Courses:</strong></p>
          {completedCourses.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Course Code</th>
                  <th className={styles.th}>Credits</th>
                  <th className={styles.th}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {completedCourses.map((course, i) => (
                  <tr key={i}>
                    <td>{course.courseCode}</td>
                    <td>{course.credits}</td>
                    <td>{course.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.italic}>No completed courses</p>
          )}
        </div>

        {!eligible && missingCourses.length > 0 && (
          <div className={styles.divider}>
            <p><strong>Missing Required Courses:</strong></p>
            <ul>
              {missingCourses.map((course, i) => (
                <li key={i}>{course}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
