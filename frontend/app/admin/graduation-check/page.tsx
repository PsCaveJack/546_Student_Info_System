"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles/page.module.css";
import GraduationDetail from "./GraduationDetail";

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


const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050/api";

export default function GraduationCheckPage() {
  const [results, setResults] = useState<GraduationResult[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [error, setError] = useState("");


  console.log("API BASE:", API_BASE);

  useEffect(() => {
    axios
      .get(`${API_BASE}/graduation-check/all`)
      .then((res) => setResults(res.data))
      .catch(() => setError("Failed to load student data"));
  }, []);

  const selectedStudent = results.find(
    (r) => r.student.email === selectedEmail
  );

  const renderStatus = (r: GraduationResult) => {
    const current = r.student.graduationStatus;

    if (current === "Approved") {
      return <span className={styles.statusApproved}>Approved</span>;
    }
    if (r.canBeApproved && current !== "Approved") {
      return (
        <span className={styles.statusWaiting}>Waiting for Approval</span>
      );
    }
    return <span className={styles.statusNotEligible}>Not Eligible</span>;
  };

  //UI
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin / Graduation Check</h2>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.studentList}>
        <div className={styles.studentItem + " " + styles.header}>
          <span>Name</span>
          <span>Email</span>
          <span>Grade</span>
          <span>Status</span>
        </div>

        {results.map((r, idx) => (
          <div
            key={idx}
            className={styles.studentItem}
            onClick={() => setSelectedEmail(r.student.email)}
          >
            <span>{r.student.name}</span>
            <span>{r.student.email}</span>
            <span>{r.student.gradeLevel}</span>
            <span>{renderStatus(r)}</span>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <GraduationDetail
          studentData={selectedStudent}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
}
