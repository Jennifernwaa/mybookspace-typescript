import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Book from '@/models/Book'; // You'll need to create this model

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    await connectToDB();
    
    const books = await Book.find({ userId, status })
      .sort({ updatedAt: -1 })
      .exec();
    
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching books by status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}