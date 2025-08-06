import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDB from '@/lib/mongodb';
import { Feed } from '@/models/Feed';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { Post } from '@/models/Post';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    await connectToDB();

    const feedEntries = await Feed.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: 'postId',
        model: Post,
        select: 'content authorId authorName likes comments createdAt',
      })
      .lean();

    const posts = feedEntries.map(entry => {
      // Handle cases where the canonical post might have been deleted
      if (!entry.postId) return null;

      // Use type assertions to let TypeScript know the types of the populated objects
      const post = entry.postId as {
        _id: mongoose.Types.ObjectId;
        content: string;
        authorId: mongoose.Types.ObjectId;
        authorName: string;
        likes: mongoose.Types.ObjectId[];
        comments: Array<{
          _id: mongoose.Types.ObjectId;
          content: string;
          authorId: mongoose.Types.ObjectId;
          authorName: string;
        }>;
        createdAt: Date;
      };

      // Now, TypeScript knows the type and won't throw errors
      return {
        _id: (entry._id as mongoose.Types.ObjectId).toString(),
        postId: post._id.toString(),
        content: post.content,
        authorId: post.authorId.toString(),
        authorName: post.authorName,
        likes: post.likes.map(id => id.toString()),
        comments: post.comments.map(comment => ({
          ...comment,
          _id: comment._id.toString(),
          authorId: comment.authorId.toString(),
        })),
        createdAt: post.createdAt,
      };
    }).filter(post => post !== null);

    return NextResponse.json({ posts });
  } catch (err) {
    console.error('GET /api/feed error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {

    // 1. Authenticate User
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) {
      console.log('Unauthorized: No token or JWT_SECRET missing');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    // 2. Parse Request Body
    const { postId } = await request.json();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      console.log('Invalid Post ID received:', postId);
      return NextResponse.json({ error: 'Invalid Post ID' }, { status: 400 });
    }

    await connectToDB();


    // 3. Find and Authorize the Post
    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      console.log('Post not found for ID:', postId);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Ensure the user trying to delete is the author of the post
    if (postToDelete.authorId.toString() !== userId) {
      console.log(`Forbidden: User ${userId} tried to delete post by ${postToDelete.authorId}`);
      return NextResponse.json({ error: 'Forbidden: You can only delete your own posts' }, { status: 403 });
    }

    // 4. Delete the Post and its Feed Entries
    console.log('Attempting to delete post from Post collection...');
    const postDeleteResult = await Post.deleteOne({ _id: postId });
    console.log('Post deletion result:', postDeleteResult);

    console.log('Attempting to delete feed entries for postId:', postId);
    const feedDeleteResult = await Feed.deleteMany({ postId: postId });
    console.log('Feed entries deletion result:', feedDeleteResult);

    // 5. Send Success Response
    console.log('Post deleted successfully!');
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });

  } catch (err) {
    console.error('DELETE /api/feed error:', err); // This will log the full error object
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
