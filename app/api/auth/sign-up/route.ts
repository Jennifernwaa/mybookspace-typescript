import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDB();
  const { email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  return NextResponse.json({ user: newUser, message: 'User created successfully' });
}
