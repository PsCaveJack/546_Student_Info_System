"use client";

import React from "react";
import styles from "./styles/AddUserForm.module.css";

//Define data needed to create AdduserForm
interface UserFormData {
  username: string;
  email: string;
  role: "admin" | "student" | "professor";
  firstName?: string;
  lastName?: string;
  password?: string;
}

interface Props {
  newUser: UserFormData;
  onChange: (field: keyof UserFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  successMessage?: string;
}

export default function AddUserForm({
  newUser,
  onChange,
  onSubmit,
  successMessage,
}: Props) {


  //UI
  return (
    <form onSubmit={onSubmit} className={styles.modalForm}>
      <h2 className={styles.formTitle}>Create User</h2>

      {successMessage && <p className={styles.successMsg}>{successMessage}</p>}

      <input
        className={styles.input}
        type="text"
        placeholder="First Name"
        value={newUser.firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Last Name"
        value={newUser.lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => onChange("email", e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Username"
        value={newUser.username}
        onChange={(e) => onChange("username", e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => onChange("password", e.target.value)}
        required
      />
      <select
        className={styles.select}
        value={newUser.role}
        onChange={(e) => onChange("role", e.target.value)}
        required
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="professor">Professor</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className={styles.button}>
        Create User
      </button>
    </form>
  );
}
