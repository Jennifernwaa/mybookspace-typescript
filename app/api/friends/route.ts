import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';
import { ApiResponse, User as UserType } from '@/types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    await connectToDB();

    const currentUser = await User.findById(userId)
      .populate('friends', '_id userName email createdAt updatedAt')
      .select('friends');

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const friendsData: UserType[] = currentUser.friends.map((friend: any) => ({
      _id: friend._id.toString(),
      userName: friend.userName,
      email: friend.email,
      friends: [], // optional to fill
      createdAt: friend.createdAt,
      updatedAt: friend.updatedAt
    }));

    const response: ApiResponse<UserType[]> = { success: true, data: friendsData };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/friends error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
