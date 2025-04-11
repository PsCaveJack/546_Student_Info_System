import { User } from "./page";

// .env.local is present then use port number that's in there, if not, fallback to use localhost:5000
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

// Fetch all users
export const fetchUsers = async (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    setUsers(data);
  } catch (err) {
    console.error("❌ fetchUsers error:", err);
  }
};

// Update a user's role
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
    console.error("❌ updateUserRole error:", err);
  }
};

// Reset a user's password
export const resetUserPassword = async (userId: string) => {
  if (!confirm("Reset this user's password to the default?")) return;

  try {
    const res = await fetch(`${API_BASE}/users/${userId}/reset-password`, {
      method: "PUT",
    });

    if (!res.ok) throw new Error("Failed to reset password");

    alert("✅ Password has been reset.");
  } catch (err) {
    console.error("❌ resetUserPassword error:", err);
    alert("Failed to reset password.");
  }
};

// Delete a user
export const deleteUser = async (
  userId: string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete user");

    setUsers((prev) => prev.filter((u) => u._id !== userId));
  } catch (err) {
    console.error("❌ deleteUser error:", err);
    alert("Failed to delete user.");
  }
};

// Create a new user
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
    console.error("❌ createUser error:", err);
  }
};
