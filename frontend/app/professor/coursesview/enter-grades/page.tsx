'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from './styles/page.module.css';
import StudentGrade, { Student } from './StudentGrades';

type CourseInfo = {
  courseCode: string;
  courseName: string;
};

export default function EnterGradesPage() {
  const courseId = useSearchParams().get('courseId');
  const [students, setStudents] = useState<Student[]>([]);
  const [originalGrades, setOriginalGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const gradeOptions = ['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F'];


  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5050/api';



  useEffect(() => {
    if (!courseId) return;

    // get courseID from URL
    axios
      .get<CourseInfo>(`${API_BASE}/course-grades/${courseId}/info`)
      .then(res => setCourseInfo(res.data))
      .catch(() => setCourseInfo({ courseCode: '', courseName: '' }));

    // Use URL to find students
    axios
      .get<Student[]>(`${API_BASE}/course-grades/${courseId}/students`)
      .then(res => {
        setStudents(res.data);
        const init: Record<string, string> = {};
        res.data.forEach(s => (init[s._id] = s.grade || ''));
        setOriginalGrades(init);
      })
      .catch(() => alert('Could not load student list.'))
      .finally(() => setLoading(false));
  }, [API_BASE, courseId]);



  const handleGradeChange = (id: string, newGrade: string) => {
    setStudents(prev => prev.map(s => (s._id === id ? { ...s, grade: newGrade } : s)));
  };

//Update grades
  const handleSubmit = async () => {
    const payload = { students: students.map(s => ({ _id: s._id, grade: s.grade || '' })) };
    try {
      await axios.put(`${API_BASE}/course-grades/${courseId}/grades`, payload);
      alert('Grades submitted!');
    } catch {
      alert('Failed to change grades.');
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
          <h1 className={styles.mainTitle}>Grades</h1>
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
        <p>No matching students found.</p>
      ) : (
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ul className={styles.studentList}>
            {filtered.map(student => (
              <StudentGrade
                key={student._id}
                student={student}
                originalGrade={originalGrades[student._id] || ''}
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
