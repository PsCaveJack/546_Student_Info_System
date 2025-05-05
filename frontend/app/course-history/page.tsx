'use client';
import React, { useEffect, useState } from 'react';
const CourseHistoryPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const next_api = process.env.NEXT_PUBLIC_API_BASE;
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('Not logged in.');
      setLoading(false);
      return;
    }
    const { _id } = JSON.parse(storedUser); // assuming backend returns _id
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${next_api}/course-history/${_id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch course history');
        }
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  if (loading) return <p className="p-8 text-center">Loading...</p>;
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Course History</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course: any, index: number) => (
            <li key={index} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{course.courseName}</h2>
              <p>Semester: {course.semester}</p>
              <p>Grade: {course.grade}</p>
              <p>Year: {course.year}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CourseHistoryPage;
                                      
