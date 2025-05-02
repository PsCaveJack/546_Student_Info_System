"use client";

// <Jack Rogers> 4-26-2025
//   use this base when pulling from the API
//   should pull from env file
//    example: NEXT_PUBLIC_API_BASE=http://localhost:5002/api
//  Everyone uses a different port number, so using a fixed string for the api destination won't work sometimes :D
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

import React, { useEffect, useState } from "react";
import styles from "./MajorsControl.module.css";

type Major = {
  name: string;
  requirements: string[];
  electives: string[];
};

export default function MajorRequirementAdminPage() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [majorForm, setMajorForm] = useState<Major>({
    name: "",
    requirements: [],
    electives: [],
  });
  const [requirementInput, setRequirementInput] = useState<string>("");
  const [electiveInput, setElectiveInput] = useState<string>("");

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch(`${API_BASE}/majors`);
        const data = await response.json();

        const transformedMajors = data.map((item: any) => ({
          name: item.majorName,
          requirements: item.requiredCourses,
          electives: item.electives || [],
        }));

        setMajors(transformedMajors);
      } catch (error) {
        console.error("Failed to fetch majors:", error);
      }
    };

    fetchMajors();
  }, []);

  const handleMajorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMajorForm({ ...majorForm, name: e.target.value });
  };

  const handleRequirementInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequirementInput(e.target.value);
  };

  const handleElectiveInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElectiveInput(e.target.value);
  };

  const addRequirement = () => {
    if (!requirementInput.trim()) {
      alert("Requirement cannot be empty.");
      return;
    }
    setMajorForm({
      ...majorForm,
      requirements: [...majorForm.requirements, requirementInput.trim()],
    });
    setRequirementInput("");
  };

  const addElective = () => {
    if (!electiveInput.trim()) {
      alert("Elective cannot be empty.");
      return;
    }
    setMajorForm({
      ...majorForm,
      electives: [...majorForm.electives, electiveInput.trim()],
    });
    setElectiveInput("");
  };

  const handleCreateMajor = async () => {
    if (!majorForm.name.trim() || majorForm.requirements.length === 0) {
      alert("Please provide a Major name and at least one requirement.");
      return;
    }

    try {
      const newMajor = {
        majorName: majorForm.name,
        requiredCourses: majorForm.requirements,
        electives: majorForm.electives,
      };

      const response = await fetch(`${API_BASE}/majors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMajor),
      });

      if (response.ok) {
        const savedMajor = await response.json();

        setMajors((prev) => [
          ...prev,
          {
            name: savedMajor.majorName,
            requirements: savedMajor.requiredCourses,
            electives: savedMajor.electives || [],
          },
        ]);

        alert("Major created successfully!");
        setMajorForm({ name: "", requirements: [], electives: [] });
        setRequirementInput("");
        setElectiveInput("");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create major");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("An error occurred: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const deleteMajor = (name: string) => {
    setMajors((prev) => prev.filter((m) => m.name !== name));
  };

  return (
    <div className={styles.container}>
      <h1>🎓 Admin: Create Majors, Requirements & Electives</h1>

      {/* Major Creation Form */}
      <div className={styles.formBox}>
        <h2>Create New Major</h2>
        <div className={styles.formGroup}>
          <input
            name="majorName"
            placeholder="Major Name"
            value={majorForm.name}
            onChange={handleMajorNameChange}
            className={styles.input}
          />

          <div className={styles.requirementBox}>
            <input
              name="requirement"
              placeholder="Add Requirement"
              value={requirementInput}
              onChange={handleRequirementInputChange}
              className={styles.input}
            />
            <button onClick={addRequirement} className={styles.button}>
              ➕ Add Requirement
            </button>
          </div>

          <div>
            <h4>Current Requirements:</h4>
            <ul>
              {majorForm.requirements.map((req, index) => (
                <li key={index}>✅ {req}</li>
              ))}
            </ul>
          </div>

          <div className={styles.requirementBox}>
            <input
              name="elective"
              placeholder="Add Elective"
              value={electiveInput}
              onChange={handleElectiveInputChange}
              className={styles.input}
            />
            <button onClick={addElective} className={styles.button}>
              ➕ Add Elective
            </button>
          </div>

          <div>
            <h4>Current Electives:</h4>
            <ul>
              {majorForm.electives.map((elec, index) => (
                <li key={index}>🎈 {elec}</li>
              ))}
            </ul>
          </div>

          <button onClick={handleCreateMajor} className={styles.button}>
            🎯 Create Major
          </button>
        </div>
      </div>

      {/* Majors List */}
      <div>
        <h2>Existing Majors</h2>
        {majors.length === 0 ? (
          <p>No majors created yet.</p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Major Name</th>
                <th className={styles.th}>Requirements</th>
                <th className={styles.th}>Electives</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {majors.map((major, idx) => (
                <tr key={idx}>
                  <td className={styles.td}>{major.name}</td>
                  <td className={styles.td}>
                    <ul>
                      {major.requirements?.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.td}>
                    <ul>
                      {major.electives.map((elec, i) => (
                        <li key={i}>{elec}</li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.td}>
                    <button onClick={() => deleteMajor(major.name)}>
                      ❌ Delete Major
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}