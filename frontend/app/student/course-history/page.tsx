'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/storage/user';
import { useRouter } from 'next/navigation';

export interface ICourseHistory {
  courseCode: string;
  grade: string;
  credits: number;
}

export default function CourseHistoryPage() {
  const [user] = useAtom(userAtom);
  const [courses, setCourses] = useState<ICourseHistory[]>([]);
  const [error, setError] = useState<string>('');
  const next_api = process.env.NEXT_PUBLIC_API_BASE;
  const router = useRouter();

  // GPA Grade scale
  const gradeScale: Record<string, number> = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'F': 0.0,
  };

  useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to login');
      router.replace('/login');
      return;
    }

    console.log('User data:', user);

    if (!user._id) {
      console.error('User ID is missing');
      setError('User ID is missing');
      return;
    }

    // If history exists in the user object, use it directly
    if (user.history) {
      setCourses(user.history);
      return;
    }

    const fetchCourses = async () => {
     
      try {
        const res = await fetch(`${next_api}/users/courses`);
        console.log('Response status:', res.status);

        if (!res.ok) {
          throw new Error('Failed to fetch course history');
        }

        const data = await res.json();
        console.log('Fetched courses:', data);

        if (data && data.courses) {
          setCourses(data.courses || []);
        } else {
          console.error('No courses found in the response');
          setError('No courses found');
        }
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'An error occurred');
      }
    };

    fetchCourses();
  }, [user, next_api]);

  // Function to calculate GPA
  const calculateGPA = (courses: ICourseHistory[]) => {
    const totalPoints = courses.reduce((total, course) => {
      const gradePoint = gradeScale[course.grade];
      return total + (gradePoint * course.credits);
    }, 0);

    const totalCredits = courses.reduce((total, course) => total + course.credits, 0);

    if (totalCredits === 0) return 0;
    return totalPoints / totalCredits;
  };

  const gpa = calculateGPA(courses);

  if (!user) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Course History</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Display GPA */}
      {gpa > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Your GPA: <span className="font-bold text-blue-500">{gpa.toFixed(2)}</span></h2>
        </div>
      )}

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Course Code</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Credits</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseCode}>
                <td className="border p-2">{course.courseCode}</td>
                <td className="border p-2">{course.grade}</td>
                <td className="border p-2">{course.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}