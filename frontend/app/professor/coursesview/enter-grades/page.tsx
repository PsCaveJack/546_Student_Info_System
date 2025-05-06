'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from './styles/page.module.css';
import StudentGrade, { Student } from './StudentGrades';

interface CourseInfo {
  courseCode: string;
  courseName: string;
}

export default function EnterGradesPage() {
  const sectionId = useSearchParams().get('sectionId');
  const [students, setStudents] = useState<Student[]>([]);
  const [originalGrades, setOriginalGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const gradeOptions = ['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F'];


  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5050/api';

  useEffect(() => {
    if (!sectionId) return;

    // fetch course info and students with this sectionId
    axios
      .get<{
        courseCode: string;
        courseName: string;
        students: Array<{
          registrationId: string;
          firstName: string;
          lastName: string;
          grade: string | null;
        }>;
      }>(`${API_BASE}/sections/${sectionId}/details`)//gets sctionId from URL
    //store courseCode and courseName
      .then(res => {
        setCourseInfo({
          courseCode: res.data.courseCode,
          courseName: res.data.courseName
        });

        //Student type
        const list: Student[] = res.data.students.map(entry => ({
          _id:       entry.registrationId,
          firstName: entry.firstName,
          lastName:  entry.lastName,
          grade:     entry.grade || ''
        }));

        setStudents(list);

        // Stores current grade
        const init: Record<string, string> = {};
        list.forEach(s => {
          init[s._id] = s.grade;
        });
        setOriginalGrades(init);
      })
      .catch(() => {
        alert('Could not load section details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_BASE, sectionId]);

//changing grade
  const handleGradeChange = (id: string, newGrade: string) => {
    setStudents(prev =>
      prev.map(s => (s._id === id ? { ...s, grade: newGrade } : s))
    );
  };
//Submit
  const handleSubmit = async () => {
    if (!sectionId) return;
    const payload = { students: students.map(s => ({ _id: s._id, grade: s.grade })) };
    try {
      await axios.put(`${API_BASE}/sections/${sectionId}/grades`, payload);
      alert('Grades submitted!');
    } catch {
      alert('Failed to submit grades.');
    }
  };

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );





  //UI
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitles}>
          <h1 className={styles.mainTitle}>Enter Grades</h1>
          {courseInfo && (
            <h2 className={styles.subTitle}>
              {courseInfo.courseCode} – {courseInfo.courseName}
            </h2>
          )}
        </div>
      </header>

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search student by name…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <p>Loading students…</p>
      ) : filtered.length === 0 ? (
        <p>No students.</p>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ul className={styles.studentList}>
            {filtered.map(student => (
              <StudentGrade
                key={student._id}
                student={student}
                originalGrade={originalGrades[student._id]}
                gradeOptions={gradeOptions}
                onChange={handleGradeChange}
              />
            ))}
          </ul>
          <div className={styles.submitWrapper}>
            <button type="submit" className={styles.submitButton}>
              Submit Grades
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
