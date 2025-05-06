'use client';

import React from 'react';
import styles from './styles/StudentGrade.module.css';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  grade: string;
  registrationId?: string;
}

interface StudentGradeProps {
  student: Student;
  originalGrade: string;
  gradeOptions: string[];
  onChange: (id: string, newGrade: string) => void;
}

export default function StudentGrade({
  student,
  originalGrade,
  gradeOptions,
  onChange
}: StudentGradeProps) {
  const hasChanged = student.grade !== originalGrade;




  
//UI
  return (
    <li className={styles.studentItem}>
      <span className={styles.studentName}>
        {student.firstName} {student.lastName}
      </span>

      <div className={styles.gradeSection}>
        {hasChanged && (
          <span className={styles.gradeChanged}>
            Grade changed
          </span>
        )}
        <label className={styles.gradeLabel} htmlFor={student._id}>
          Grade:
        </label>
        <select
          id={student._id}
          className={`${styles.select} ${hasChanged ? styles.selectChanged : ''}`}
          value={student.grade}
          onChange={e => onChange(student._id, e.target.value)}
        >
          <option value="">--</option>
          {gradeOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
