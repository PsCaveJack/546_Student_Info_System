"use client";

import React, { useState } from "react";
import styles from "./MajorsControl.module.css";

type Major = {
  name: string;
  requirements: string[];
};

export default function MajorRequirementAdminPage() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [majorForm, setMajorForm] = useState<Major>({
    name: "",
    requirements: [],
  });
  const [requirementInput, setRequirementInput] = useState<string>("");

  // Handle input changes
  const handleMajorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMajorForm({ ...majorForm, name: e.target.value });
  };

  const handleRequirementInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequirementInput(e.target.value);
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

  const handleCreateMajor = async () => {
    if (!majorForm.name.trim() || majorForm.requirements.length === 0) {
      alert("Please provide a Major name and at least one requirement.");
      return;
    }

    try {
      // Send the data to the API route
      const response = await fetch("/api/majors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(majorForm),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Major created successfully!");
        // Optionally, update the list of majors after successful creation
        setMajors((prev) => [...prev, data.data]);

        // Reset the form
        setMajorForm({ name: "", requirements: [] });
        setRequirementInput("");
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
      <h1>🎓 Admin: Create Majors & Requirements</h1>

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
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {majors.map((major, idx) => (
                <tr key={idx}>
                  <td className={styles.td}>{major.name}</td>
                  <td className={styles.td}>
                    <ul>
                      {major.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
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