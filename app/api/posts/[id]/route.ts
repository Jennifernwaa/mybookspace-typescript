import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { Feed } from '@/models/Feed';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    await connectToDB();

    const post = await Post.findById(context.params.id);
    if (!post || post.authorId.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 });
    }

    await Post.deleteOne({ _id: post._id });
    await Feed.deleteMany({ postId: post._id });

    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('DELETE /api/posts/:id error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
