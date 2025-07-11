import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Helper function to authenticate user
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

// POST /api/books - Add a new book for a user
export async function POST(request: NextRequest) {
  try {
    await connectToDB(); // Connect to your MongoDB database

    // Authenticate user
    const authResult = await authenticateUser(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const authenticatedUserId = authResult.userId; // Get userId from authenticated token

    const bookData = await request.json(); // Get all book data from the request body

    // FIX: Use the authenticatedUserId for database operations
    const userObjectId = new mongoose.Types.ObjectId(authenticatedUserId);

    // Validate bookData.isbn and bookData.title exist for duplicate check
    if (!bookData.title) {
      return NextResponse.json({ error: 'Book title is required for saving.' }, { status: 400 });
    }

    // Check for duplicate book for this user using the authenticatedUserId
    let existingBook;
    if (bookData.isbn && bookData.isbn !== 'Not available') {
      // Check by ISBN if available
      existingBook = await Book.findOne({ userId: userObjectId, isbn: bookData.isbn });
    } else {
      // Otherwise, check by title
      existingBook = await Book.findOne({ userId: userObjectId, title: bookData.title });
    }

    if (existingBook) {
      return NextResponse.json({ message: 'This book is already in your library.' }, { status: 409 }); // 409 Conflict
    }

    // Create a new book document, explicitly setting userId from the authenticated token
    const newBook = await Book.create({
      userId: userObjectId, // Use the authenticated user's ObjectId
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
  const authenticatedUserId = authResult.userId; // Get userId from authenticated token

  // Extract userId from query parameters (e.g., /api/books?userId=...)
  const { searchParams } = new URL(request.url);
  const userIdFromQuery = searchParams.get('userId');

  // FIX: If no userId is provided in query, assume current authenticated user
  // If userIdFromQuery is provided, ensure it matches the authenticated user for security
  const targetUserId = userIdFromQuery || authenticatedUserId;


  // Security check: Ensure the authenticated user is requesting their own books
  // This prevents one user from fetching another user's books by changing the query param
  if (authenticatedUserId !== targetUserId) {
    return NextResponse.json(
      { error: 'Unauthorized: You can only view your own books' },
      { status: 403 }
    );
  }

  // Validate userId format as ObjectId
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
  }

  try {
    // Convert userId string to Mongoose ObjectId for the query
    const userObjectId = new mongoose.Types.ObjectId(targetUserId);
    
    // Find all books associated with this userId
    const userBooks = await Book.find({ userId: userObjectId }).sort({ createdAt: -1 }); // Added sorting for consistency

    // FIX: Wrap userBooks in an object with a 'books' key, as expected by MyBooksPage.tsx
    return NextResponse.json({ books: userBooks }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}