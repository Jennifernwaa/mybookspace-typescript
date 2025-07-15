// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';
import { Post } from '@/models/Post';
import { Feed } from '@/models/Feed';
import { ApiResponse, Post as PostType } from '@/types';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function authenticateUser(request: NextRequest): Promise<
  { error: string; status: number } | { userId: string }
> {
  const token = request.cookies.get('token')?.value;
  if (!token) return { error: 'Unauthorized: No token', status: 401 };
  if (!JWT_SECRET) return { error: 'JWT_SECRET not configured', status: 500 };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return { error: 'Invalid token', status: 403 };
    }
    return { userId: decoded.userId };
  } catch {
    return { error: 'Token verification failed', status: 403 };
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { content } = await request.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }
    if (content.length > 500) {
      return NextResponse.json({ success: false, error: 'Content is too long (max 500 characters)' }, { status: 400 });
    }

    await connectToDB();

    const currentUser = await User.findById(auth.userId).populate('friends');
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const post = new Post({
      content: content.trim(),
      authorId: currentUser._id,
      authorName: currentUser.userName
    });
    await post.save();

    const feedPromises = [];

    // Add to own feed
    feedPromises.push(
      new Feed({
        postId: post._id,
        content: post.content,
        authorId: post.authorId,
        authorName: post.authorName,
        originalAuthorId: post.authorId,
        userId: currentUser._id
      }).save()
    );

    // Fan out to friends
    for (const friendId of currentUser.friends) {
      feedPromises.push(
        new Feed({
          postId: post._id,
          content: post.content,
          authorId: post.authorId,
          authorName: post.authorName,
          originalAuthorId: post.authorId,
          userId: friendId
        }).save()
      );
    }

    await Promise.all(feedPromises);

    const response: ApiResponse<PostType> = {
      success: true,
      data: {
        _id: post._id.toString(),
        content: post.content,
        authorId: post.authorId.toString(),
        authorName: post.authorName,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      },
      message: 'Post created successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
