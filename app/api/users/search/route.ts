import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ApiResponse, SearchResult } from '@/types';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    await connectToDB();

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const users = await User.find({
      _id: { $ne: currentUser._id }, // Exclude self
      userName: { $regex: query, $options: 'i' }
    })
      .select('_id userName email')
      .limit(20);

    const searchResults: SearchResult[] = users.map(user => ({
      _id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      isFriend: currentUser.friends.includes(user._id)
    }));

    const response: ApiResponse<SearchResult[]> = {
      success: true,
      data: searchResults
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
