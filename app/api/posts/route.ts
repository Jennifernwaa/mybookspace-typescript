import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { Feed } from '@/models/Feed';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { userId } = decoded;

    await connectToDB();

    const currentUser = await User.findById(userId);
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { content } = await request.json();

    const newPost = await Post.create({
      content,
      authorId: currentUser._id,
      authorName: currentUser.userName || currentUser.fullName || 'Anonymous',
    });

    const feedEntry = {
      postId: newPost._id,
      content: newPost.content,
      authorId: currentUser._id,
      authorName: newPost.authorName,
      originalAuthorId: currentUser._id,
      authorAvatar: '', // optional
    };

    const feedDocs = [currentUser._id, ...(currentUser.friends || [])].map(friendId => ({
      ...feedEntry,
      userId: friendId,
    }));

    await Feed.insertMany(feedDocs);

    return NextResponse.json({ success: true, post: newPost });
  } catch (err) {
    console.error('POST /api/posts error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
