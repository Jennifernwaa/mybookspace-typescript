// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User'; // Assuming you have a Mongoose User model
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Helper function to authenticate user (copied from your previous context for completeness)
async function authenticateUser(request: NextRequest): Promise<
  { error: string; status: number } | { userId: string }
> {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return { error: 'Unauthorized: No token provided', status: 401 };
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return { error: 'Server configuration error', status: 500 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    
    if (!decoded.userId) {
      return { error: 'Invalid token: Missing user ID', status: 403 };
    }
    
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return { error: 'Invalid user ID in token', status: 403 };
    }
    
    return { userId: decoded.userId };
  } catch (err) {
    console.error('Token verification failed:', err);
    return { error: 'Invalid or expired token', status: 403 };
  }
}

// GET /api/users/[userId]
export async function GET(
  request: NextRequest,
  context: any // FIX: Removed explicit type to allow inference
) {
  try {
    await connectToDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  // Authenticate user
  const authResult = await authenticateUser(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const authenticatedUserId = authResult.userId;

  // FIX: Access params via context and cast userId to string
  const userId = context.params.userId as string; 

  // Security check: Ensure the authenticated user is requesting their own profile
  if (authenticatedUserId !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized: You can only view your own profile' },
      { status: 403 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
  }
    
  try {
    // Get user and update lastActive in one operation
    // Using findByIdAndUpdate to return the *original* document before update
    // and skip validation for just the lastActive field.
    const user = await User.findByIdAndUpdate(
      userId,
      { lastActive: new Date() }, // Store as Date object
      { 
        new: false, // Return the original document before the update
        runValidators: false, // Skip validation on the update payload (e.g., for 'lastActive')
        upsert: false // Don't create a new document if it doesn't exist
      }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data (consider stripping sensitive info like password hash)
    const { password, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/users/[userId]
export async function PATCH(
  request: NextRequest,
  context: any // FIX: Removed explicit type to allow inference
) {
  try {
    await connectToDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  // Authenticate user
  const authResult = await authenticateUser(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const authenticatedUserId = authResult.userId;

  // FIX: Access params via context and cast userId to string
  const userId = context.params.userId as string;

  // Security check: Ensure the authenticated user is updating their own profile
  if (authenticatedUserId !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized: You can only update your own profile' },
      { status: 403 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
  }

  try {
    const updates = await request.json();
    
    // Add lastActive to updates
    updates.lastActive = new Date(); // Store as Date object
    
    // Use findByIdAndUpdate to update the document by its _id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates }, // Use $set to apply updates to specified fields
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators on the update payload
      } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the updated user data (consider stripping sensitive info)
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return NextResponse.json({ message: 'Profile updated', user: userWithoutPassword });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      // Mongoose validation errors will have a 'name' property of 'ValidationError'
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/users/[userId] (for full replacement or specific updates)
// Often PATCH is preferred for partial updates, but PUT can be used for full replacement.
// If you want to use PUT for partial updates, ensure your schema handles missing fields gracefully.
export async function PUT(
  request: NextRequest,
  context: any // FIX: Removed explicit type to allow inference
) {
  try {
    await connectToDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  // Authenticate user
  const authResult = await authenticateUser(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const authenticatedUserId = authResult.userId;

  const userId = context.params.userId as string;

  // Security check: Ensure the authenticated user is updating their own profile
  if (authenticatedUserId !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized: You can only update your own profile' },
      { status: 403 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
  }

  try {
    const updates = await request.json();
    updates.lastActive = new Date(); // Update last active timestamp

    // Using findByIdAndUpdate with $set for partial updates, similar to PATCH
    // If you intend PUT to be a full replacement, you might omit $set and pass `updates` directly.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { 
        new: true, 
        runValidators: true, // Run validators on the new data
        overwrite: false // Important: set to false to prevent overwriting the entire document
      } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return NextResponse.json({ message: 'Profile updated', user: userWithoutPassword });
  } catch (error: any) {
    console.error('Error updating user (PUT):', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/users/[userId]
export async function DELETE(
  request: NextRequest,
  context: any // FIX: Removed explicit type to allow inference
) {
  try {
    await connectToDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  // Authenticate user
  const authResult = await authenticateUser(request);
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  const authenticatedUserId = authResult.userId;

  const userId = context.params.userId as string;

  // Security check: Ensure the authenticated user is deleting their own profile
  if (authenticatedUserId !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized: You can only delete your own profile' },
      { status: 403 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
