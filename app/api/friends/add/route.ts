import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function authenticate(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const currentUserId = await authenticate(request);
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { targetUserId } = await request.json();
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json({ success: false, error: 'Invalid target ID' }, { status: 400 });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (currentUser.friends.includes(targetUserId)) {
      return NextResponse.json({ success: false, error: 'Already friends' }, { status: 400 });
    }

    currentUser.friends.push(targetUserId);
    targetUser.friends.push(currentUserId);
    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({ success: true, message: 'Friend added successfully' });
  } catch (error) {
    console.error('POST /api/friends/add error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
