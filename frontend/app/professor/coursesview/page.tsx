'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "@/storage/user";
import { Section } from "@/types/sectionTypes";
import "./ViewSectionsPage.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050/api";

export default function ViewSectionsPage() {
  const [user] = useAtom(userAtom);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to login if not logged in
      return;
    }

    const fetchSections = async () => {
      try {
        const res = await fetch(`${API_BASE}/sections`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Section[] = await res.json();

        // Filter by instructor (e.g., username or email depending on how it's stored)
        const professorSections = data.filter(
          section => section.instructor.toLowerCase() === user.username?.toLowerCase() // or user.email
        );

        setSections(professorSections);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [user, router]);

  const handleViewStudents = (courseCode: string) => {
    router.push(`/professor/course/${courseCode}/students`);
  };

  return (
    <div className="sections-container">
      <h1 className="sections-heading">My Sections</h1>

      {loading && <p>Loading sections...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && sections.length === 0 && (
        <p>No sections found for you.</p>
      )}

      <ul className="sections-list">
        {sections.map((section) => (
          <li key={section._id} className="section-item">
            <h2 className="section-title">
              {section.courseCode} – Section {section.section}
            </h2>
            <p><strong>Semester:</strong> {section.semester}</p>
            <p><strong>Instructor:</strong> {section.instructor}</p>
            <p>
              <strong>Schedule:</strong> {section.schedule.days.join(', ')} @ {section.schedule.time}
            </p>
            <div className="button-group">
              <button
                className="section-button"
                onClick={() => handleViewStudents(section.courseCode)}
              >
                View Students
              </button>
              <Link
                href={`/professor/coursesview/enter-grades?sectionId=${section._id}`}
                className="section-button"
              >
                View Grades
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}