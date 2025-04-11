import { User } from "./page";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const fetchUsers = async (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    setUsers(data);
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: User["role"],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (!res.ok) throw new Error("Failed to update role");

    const updatedUser = await res.json();
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: updatedUser.role } : u))
    );
  } catch (err) {
    console.error("Error updating role:", err);
  }
};

export const resetUserPassword = async (userId: string) => {
  const confirmReset = confirm("Reset this user's password to the default?");
  if (!confirmReset) return;

  try {
    const res = await fetch(`${API_BASE}/users/${userId}/reset-password`, {
      method: "PUT",
    });

    if (!res.ok) throw new Error("Failed to reset password");

    alert("Password has been reset.");
  } catch (err) {
    console.error("Error resetting password:", err);
    alert("Failed to reset password.");
  }
};

export const deleteUser = async (
  userId: string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete user");

    setUsers((prev) => prev.filter((u) => u._id !== userId));
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("Failed to delete user.");
  }
};

export const createUser = async (
  e: React.FormEvent,
  newUser: Omit<User, "_id">,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  resetForm: () => void
) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error("Failed to create user");

    const createdUser = await res.json();
    setUsers((prev) => [...prev, createdUser]);
    resetForm();
  } catch (err) {
    alert("Error creating user");
    console.error(err);
  }
};
