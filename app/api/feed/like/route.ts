import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { Post } from '@/models/Post';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const { postId } = await request.json();

    await connectToDB();

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({
      success: true,
      likes: post.likes,
      isLiked: !isLiked,
    });
  } catch (err) {
    console.error('POST /api/feed/like error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
