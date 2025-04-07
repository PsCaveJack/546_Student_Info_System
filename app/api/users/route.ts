// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    await connectToDB();
    const newUser = await User.create({ name, email, role });

    return NextResponse.json({ message: 'User created', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  console.log('GET /api/users called');
  try {
    await connectToDB();
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Fetching users failed:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}