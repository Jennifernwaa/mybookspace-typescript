
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const updateUserSchema = z.object({
  userName: z.string().min(1).max(50),
  bio: z.string().max(300).optional(),
  favoriteGenre: z.string().optional(),
  readingGoal: z.number().int().min(1).max(365).optional(),
  favoriteAuthor: z.string().max(100).optional(),
  publicReadingList: z.boolean().optional(),
  showProgress: z.boolean().optional(),
  friendRecs: z.boolean().optional(),
});

const JWT_SECRET = process.env.JWT_SECRET as string;

// Authenticate user using cookie
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

// GET user profile
export async function GET(request: NextRequest, context: any) {
  try {
    await connectToDB();

    const auth = await authenticateUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { userId } = await context.params;

    // Compare both as strings to avoid 403 error
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

    const { userId } = context.params;
    if (auth.userId !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    if (!mongoose.Types.ObjectId.isValid(userId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const updates = await request.json();
    const parsed = updateUserSchema.safeParse(updates);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.errors }, { status: 400 });
    }

    updates.lastActive = new Date();

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: parsed.data },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { uid } = params;
    
    // Users can only update their own profile
    if (session.user.id !== uid) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    await connectToDB();
    
    const updatedUser = await User.findByIdAndUpdate(
      uid,
      {
        ...validatedData,
        lastActive: new Date(),
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error' },
        { status: 400 }
      );
    }
    
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
