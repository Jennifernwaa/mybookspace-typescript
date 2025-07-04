import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { User } from '@/models/User';
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
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Return only safe user data
  return NextResponse.json({ message: 'Sign in successful', user: { _id: user._id, email: user.email } });
}
