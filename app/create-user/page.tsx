'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
  });

  const [message, setMessage] = useState('');
  const currentUser = {
    name: 'Admin User',
    role: 'admin', // Change to test access control
  };
  
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
  
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
  
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        email: formData.email,
        role: formData.role,
      }),
    });

    const data = await res.json();
    setMessage(data.message);
    setFormData({ firstName: '', lastName: '', email: '', role: 'student' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Create a New User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="p-2 rounded border"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="p-2 rounded border"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="p-2 rounded border"
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="p-2 rounded border text-black bg-white"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
          Create User
        </button>
        {message && <p className="text-green-600">{message}</p>}
      </form>

      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Back to Home
      </Link>
      {currentUser.role === 'admin' && (
        <div className="mt-12 w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 text-center">All Users</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, index) => (
                <tr key={index} className="text-center bg-white dark:bg-gray-900">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}