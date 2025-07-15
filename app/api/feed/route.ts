import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { Feed } from '@/models/Feed';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    await connectToDB();

    const posts = await Feed.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ posts });
  } catch (err) {
    console.error('GET /api/feed error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
