"use client";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { Section } from "@/types/sectionTypes"; // make sure this file exists
import "./ViewSectionsPage.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050/api";

export default function ViewSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch(`${API_BASE}/sections`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Section[] = await res.json();
        setSections(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  return (
    <div className="sections-container">
      <h1 className="sections-heading">My Sections</h1>

      {loading && <p>Loading sections...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && sections.length === 0 && (
        <p>No sections found.</p>
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
              <button className="section-button">
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
