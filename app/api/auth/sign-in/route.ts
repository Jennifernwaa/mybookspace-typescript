import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Incorrect email or password' }, { status: 401 });
  }

  // Update last active on sign-in
  await User.findByIdAndUpdate(
    user._id,
    { lastActive: new Date().toISOString() },
    { runValidators: false }
  );

  // Return user data including the _id for client-side storage
  return NextResponse.json({ 
    message: 'Sign in successful', 
    user: { 
      _id: user._id.toString(), // Convert ObjectId to string
      email: user.email,
      userName: user.userName || '',
    } 
  });
}