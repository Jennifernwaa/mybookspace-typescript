// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// ✅ Authenticate user using cookie
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

// ✅ GET user profile
export async function GET(request: NextRequest, context: any) {
  try {
    await connectToDB();

    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { userId } = await context.params;

    // 🔧 Compare both as strings to avoid 403 error
    if (auth.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { lastActive: new Date() },
      { new: false, runValidators: false }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...rest } = user.toObject();
    return NextResponse.json(rest);
  } catch (err) {
    console.error('GET user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// PATCH to update user (partial)
export async function PATCH(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const auth = await authenticateUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { userId } = await context.params;
    if (auth.userId !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    if (!mongoose.Types.ObjectId.isValid(userId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const updates = await request.json();
    updates.lastActive = new Date();

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { password, ...rest } = updated.toObject();
    return NextResponse.json({ message: 'Profile updated', user: rest });
  } catch (err: any) {
    console.error('PATCH user error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const auth = await authenticateUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { userId } = await context.params;
    if (auth.userId !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    if (!mongoose.Types.ObjectId.isValid(userId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    console.error('DELETE user error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
