"use client";

import React, { useEffect, useState } from "react";
import styles from "./AccountControl.module.css";
import mockUsers from "./mock-users.json";

type User = {
  name: string;
  email: string;
  password?: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "blocked";
};

export default function AccountControlPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "student",
    status: "active"
  });

  // Load mock users on mount
  useEffect(() => {
    setUsers(mockUsers as User[]) ;
  }, []);

  // Form logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateUser = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields.");
      return;
    }

    const newUser: User = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      status: "active"
    };

    setUsers([...users, newUser]);
    setForm({ name: "", email: "", password: "", role: "student", status: "active" });
    alert("User added (mock)");
  };

  // Feature handlers
  const deleteUser = (email: string) => {
    setUsers((prev) => prev.filter((u) => u.email !== email));
  };

  const changeUserRole = (email: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === email ? { ...u, role: newRole as User["role"] } : u
      )
    );
  };

  const resetPassword = (email: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === email ? { ...u, password: "new-password123" } : u
      )
    );
    alert(`Password for ${email} reset to: new-password123 (mock)`);
  };

  const toggleBlock = (email: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === email
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  return (
    <div className={styles.container}>
      <h1>👤 Admin Account Control</h1>

      {/* Create User Form */}
      <div className={styles.formBox}>
        <h2>Create New User</h2>
        <div className={styles.formGroup}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className={styles.input}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleCreateUser} className={styles.button}>
            ➕ Create User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div>
        <h2>Existing Users</h2>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td className={styles.td}>{user.name}</td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>{user.role}</td>
                <td className={styles.td}>{user.status}</td>
                <td className={styles.td}>
                  <button onClick={() => resetPassword(user.email)} style={{ marginRight: "0.5rem" }}>
                    🔄 Reset
                  </button>
                  <button onClick={() => deleteUser(user.email)} style={{ marginRight: "0.5rem" }}>
                    ❌ Delete
                  </button>
                  <select
                    defaultValue={user.role}
                    onChange={(e) => changeUserRole(user.email, e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={() => toggleBlock(user.email)}>
                    {user.status === "blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
