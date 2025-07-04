import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    if (!userData.userId || !userData.userName || !userData.fullName) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, userName, fullName' 
      }, { status: 400 });
    }

    await connectToDB();
    
    // Check if user already exists 
    const existingUser = await User.findOne({ userId: userData.userId });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Check if userName is already taken
    const existingUserName = await User.findOne({ userName: userData.userName });
    if (existingUserName) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Create new user
    const newUser = new User({
      ...userData,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });

    await newUser.save();
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}