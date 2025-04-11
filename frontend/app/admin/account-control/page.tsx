"use client";

import React, { useEffect, useState } from "react";
import styles from "./AccountControl.module.css";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";

import {
  fetchUsers,
  updateUserRole,
  resetUserPassword,
  deleteUser,
  createUser,
} from "./userHandlers";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "student" | "professor";
  firstName?: string;
  lastName?: string;
  password?: string;
}

export default function AccountControlPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, "_id">>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    fetchUsers(setUsers);
  }, []);

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    updateUserRole(userId, newRole, setUsers);
  };

  const handleResetPassword = (userId: string) => {
    resetUserPassword(userId);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId, setUsers);
  };

  const handleAddUser = (e: React.FormEvent) => {
    createUser(e, newUser, setUsers, () =>
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        role: "student",
      })
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Account Control Page</h1>
      <UserTable
        users={users}
        onRoleChange={handleRoleChange}
        onResetPassword={handleResetPassword}
        onDeleteUser={handleDeleteUser}
      />
      <AddUserForm
        newUser={newUser}
        onChange={(field, value) =>
          setNewUser((prev) => ({ ...prev, [field]: value }))
        }
        onSubmit={handleAddUser}
      />
    </div>
  );
}
