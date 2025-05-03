"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";


import React, { useEffect, useState } from "react";
import { Course } from "@/types/classTypes"; // adjust path as needed
import "./ViewCoursesPage.css";

export default function ViewCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="courses-container">
      <h1 className="courses-heading">My Courses</h1>

      {loading && <p>Loading courses...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && courses.length === 0 && (
        <p>No courses found.</p>
      )}

      <ul className="courses-list">
        {courses.map((course) => (
          <li key={course.courseCode} className="course-item">
            <h2 className="course-name">{course.courseName}</h2>
            <p><strong>Course ID:</strong> {course.courseCode}</p>
            <p><strong>Course Name:</strong> {course.courseName}</p>
            <p><strong>Description:</strong> {course.description}</p>
            <div className="button-group">
              <button className="course-button">View Students</button>
              <button className="course-button">View Grades</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}