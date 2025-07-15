import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import { Post } from '@/models/Post';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function DELETE(
request: NextRequest, 
context: any
 ) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token || !JWT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { userId } = decoded;

    await connectToDB();

    const post = await Post.findById(context.params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Post.findByIdAndDelete(context.params.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
