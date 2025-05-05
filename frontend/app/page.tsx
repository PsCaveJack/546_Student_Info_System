'use client';

import { useState } from 'react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('student'); // <-- added role selection
	const [error, setError] = useState('');
	const next_api = process.env.NEXT_PUBLIC_API_BASE;
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const res = await fetch(`${next_api}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, role }),
			});    const responseText = await res.text();
			console.log('Response:', responseText);

			if (!res.ok) {
				throw new Error('Failed to load JSON response');
			}

			const data = JSON.parse(responseText);
			console.log('Login successful!', data);

			// Save user or redirect here
		} catch (err: any) {
			console.error('Login error:', err);
			setError(err.message);
		}
	};
	return (
		<div className="p-8 max-w-md mx-auto">
		<h1 className="text-2xl font-bold mb-4">Login</h1>
		<form onSubmit={handleLogin} className="space-y-4">
		<input
		type="email"
		placeholder="Email"
		className="w-full p-2 border rounded"
		value={email}
		onChange={e => setEmail(e.target.value)}
		required
		/>
		<input
		type="password"
		placeholder="Password"
		className="w-full p-2 border rounded"
		value={password}
		onChange={e => setPassword(e.target.value)}
		required
		/>
		<select
		value={role}
		onChange={e => setRole(e.target.value)}
		className="w-full p-2 border rounded"
		>
		<option value="student">Student</option>
		<option value="teacher">Teacher</option>
		<option value="admin">Admin</option>
		</select>
		<button
		type="submit"
		className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
		>
		Login
		</button>
		{error && <p className="text-red-500">{error}</p>}
		</form>
		</div>
	);

}
