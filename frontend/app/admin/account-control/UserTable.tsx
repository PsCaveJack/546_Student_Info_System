"use client";
import React from "react";
import styles from "../account-control/AccountControl.module.css";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "student" | "professor";
  firstName?: string;
  lastName?: string;
  password?: string;
}

interface Props {
  users: User[];
  onRoleChange: (userId: string, newRole: User["role"]) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string) => void;
}

export default function UserTable({
  users,
  onRoleChange,
  onDeleteUser,
  onResetPassword,
}: Props) {
  return (
    <table className={styles.userTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.username}</td>
            <td>
              <select
                className={styles.select}
                value={user.role}
                onChange={(e) =>
                  onRoleChange(user._id, e.target.value as User["role"])
                }
              >
                <option value="student">Student</option>
                <option value="professor">Professor</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <button className={styles.deleteButton} onClick={() => onDeleteUser(user._id)}>Delete</button>
              <button className={styles.resetButton} onClick={() => onResetPassword(user._id)}>Reset Password</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
