"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/page.module.css";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";

import {
  fetchUsers,
  updateUserRole,
  resetUserPassword,
  deleteUser,
  createUser,
} from "./userHandlers";

//information a user account should contain
export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "student" | "professor";
  firstName?: string;
  lastName?: string;
  password?: string;
}
//Frontend functions
export default function AccountControlPage() {
  //stores the list of user fetched from backend
  const [users, setUsers] = useState<User[]>([]);

  //stores new user created from AdduserForm
  const [newUser, setNewUser] = useState<Omit<User, "_id">>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    role: "student",
  });

  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //Fetch
  useEffect(() => {
    fetchUsers(setUsers);
  }, []);
  //Updates role
  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    updateUserRole(userId, newRole, setUsers);
  };
  //Resets password
  const handleResetPassword = (userId: string) => {
    resetUserPassword(userId);
  };
  //Delete
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId, setUsers);
  };
  //AddUserForm
  const handleAddUser = (e: React.FormEvent) => {
    createUser(e, newUser, setUsers, () => {
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        role: "student",
      });
      setShowForm(false);
      setSuccessMessage("✅ User created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); 
    });
  };


  //UI
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin/Account Control Page</h1>

      {successMessage && (
        <div className={styles.successToast}>{successMessage}</div>
      )}

    <div className={styles.topHeaderRow}>

      <h2 className={styles.sectionTitle}>Existing Users</h2>

      <button className={styles.createButton} onClick={() => setShowForm(true)}>
        + Create User
      </button>

    </div>

      <UserTable
        users={users}
        onRoleChange={handleRoleChange}
        onResetPassword={handleResetPassword}
        onDeleteUser={handleDeleteUser}
      />


      <div className={styles.inlineAddButtonWrapper}>
        <button
          className={styles.inlineAddButton}
          onClick={() => setShowForm(true)}
        >
          + Create User
        </button>
      </div>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setShowForm(false)}>
              ✕
            </button>
            <AddUserForm
              newUser={newUser}
              onChange={(field, value) =>
                setNewUser((prev) => ({ ...prev, [field]: value }))
              }
              onSubmit={handleAddUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
