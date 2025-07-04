import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Await params before destructuring userId, as indicated by the error message.
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDB();
    
    // Get user and update lastActive in one operation to avoid validation
    // The userId from params is used as the document's _id
    const user = await User.findByIdAndUpdate(
      userId,
      { lastActive: new Date().toISOString() },
      { 
        new: false, // Return the original document before the update
        runValidators: false, // Skip validation on the update payload (e.g., for 'lastActive')
        upsert: false // Don't create a new document if it doesn't exist
      }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) { // Add type annotation for error
    console.error('Error fetching user:', error);
    // Check if the error is specifically a Mongoose validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Await params before destructuring userId, as indicated by the error message.
    const { userId } = await params;
    const updates = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDB();
    
    // Add lastActive to updates
    updates.lastActive = new Date().toISOString();
    
    // Use findByIdAndUpdate to update the document by its _id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates }, // Use $set to apply updates to specified fields
      { 
        new: true, // Return the updated document
        runValidators: false // Skip validation for the update payload
      } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) { // Add type annotation for error
    console.error('Error updating user:', error);
    // Check if the error is specifically a Mongoose validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
