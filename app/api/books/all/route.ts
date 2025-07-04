import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import mongoose from 'mongoose'; 
import ObjectId from 'mongodb'; // Import ObjectId for MongoDB ID validation

// POST /api/books - Add a new book for a user
export async function POST(request: NextRequest) {
  try {
    await connectToDB(); // Connect to your MongoDB database

    const { userId, ...bookData } = await request.json(); // Destructure userId and other book data

    // Validate userId as a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    // Check for duplicate book for this user
    let existingBook;
    if (bookData.isbn && bookData.isbn !== 'Not available') {
      // Check by ISBN if available
      existingBook = await Book.findOne({ userId: userId, isbn: bookData.isbn });
    } else {
      // Otherwise, check by title
      existingBook = await Book.findOne({ userId: userId, title: bookData.title });
    }

    if (existingBook) {
      return NextResponse.json({ message: 'This book is already in your library.' }, { status: 409 }); // 409 Conflict
    }

    // Create a new book document
    const newBook = await Book.create({
      userId: new mongoose.Types.ObjectId(userId), // Convert string userId to ObjectId
      ...bookData,
      dateAdded: new Date().toISOString(), // Ensure dateAdded is set
    });

    return NextResponse.json(newBook, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error('Error adding book:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/books - Get all books for a specific user
export async function GET(request: NextRequest) {
  try {
    await connectToDB(); // Connect to your MongoDB database

    // Get userId from query parameters (e.g., /api/books?userId=...)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    // Find all books associated with this userId
    const userBooks = await Book.find({ userId: new mongoose.Types.ObjectId(userId) });

    return NextResponse.json(userBooks, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
