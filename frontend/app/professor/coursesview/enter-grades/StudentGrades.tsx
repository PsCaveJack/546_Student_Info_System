// src/app/professors/coursesview/enter-grades/StudentGradeRow.tsx
'use client';

import React from 'react';
import styles from './styles/StudentGrade.module.css';

export type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  grade?: string;
};

interface Props {
  student: Student;
  originalGrade: string;
  gradeOptions: string[];
  onChange: (id: string, grade: string) => void;
}

export default function StudentGradeRow({
  student,
  originalGrade,
  gradeOptions,
  onChange,
}: Props) {
  const current = student.grade || '';
  const changed = originalGrade !== current;

  return (
    <li key={student._id} className={styles.studentItem}>
      <span className={styles.studentName}>
        {student.firstName} {student.lastName}
      </span>
      <div className={styles.gradeSection}>
        {changed && <span className={styles.changedTag}>Grade changed</span>}
        <label className={styles.gradeLabel}>Grade:</label>
        <select
          value={current}
          onChange={e => onChange(student._id, e.target.value)}
          className={`${styles.select} ${changed ? styles.selectChanged : ''}`}
        >
          <option value="">Select grade</option>
          {gradeOptions.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}
