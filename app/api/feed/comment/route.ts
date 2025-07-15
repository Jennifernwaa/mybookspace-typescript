import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { Post } from '@/models/Post';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const { postId, content } = await request.json();

    await connectToDB();

    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post || !user) return NextResponse.json({ error: 'Invalid post or user' }, { status: 404 });

    post.comments.push({
      content,
      authorId: user._id,
      authorName: user.userName || user.fullName || 'Anonymous',
    });

    await post.save();

    return NextResponse.json({ comments: post.comments });
  } catch (err) {
    console.error('POST /api/feed/comment error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
