import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Book } from '@/models/Book';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  await connectToDB();
  const user = await User.findOne({ _id: params.userId }).populate('books');
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ user });
}