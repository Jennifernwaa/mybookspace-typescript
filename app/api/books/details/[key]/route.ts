// app/api/books/[bookId]/route.ts
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
    
    // Check if userId exists in the token
    if (!decoded.userId) {
      return { error: 'Invalid token: Missing user ID', status: 403 };
    }
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return { error: 'Invalid user ID in token', status: 403 };
    }
    
    return { userId: decoded.userId };
  } catch (err) {
    console.error('Token verification failed:', err);
    return { error: 'Invalid or expired token', status: 403 };
  }
}

// Helper function to validate and get book with authorization check
async function getBookWithAuth(bookId: string, userId: string) {
  // Validate bookId format
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return { error: 'Invalid Book ID', status: 400 };
  }

  try {
    const book = await Book.findById(bookId);
    
    if (!book) {
      return { error: 'Book not found', status: 404 };
    }

    // Check if user owns this book
    if (book.userId.toString() !== userId) {
      return { error: 'Unauthorized: Not your book', status: 403 };
    }

    return { book };
  } catch (err: any) {
    console.error('Database error in getBookWithAuth:', err);
    return { error: 'Internal error', status: 500 };
  }
}

// GET /api/books/[bookId]
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

  const { userId } = authResult;
  // FIX: Access params and cast bookId to string
  const { bookId } = await context.params; 

  // Get book with authorization
  const bookResult = await getBookWithAuth(bookId, userId);
  if (bookResult.error) {
    return NextResponse.json(
      { error: bookResult.error },
      { status: bookResult.status }
    );
  }

  return NextResponse.json(bookResult.book);
}

// PUT /api/books/[bookId]
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

  const { userId } = authResult;
  // FIX: Access params and cast bookId to string
  const { bookId } = await context.params; 

  // Get book with authorization (ensures user owns the book before updating)
  const bookResult = await getBookWithAuth(bookId, userId);
  if (bookResult.error) {
    return NextResponse.json(
      { error: bookResult.error },
      { status: bookResult.status }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    
    // Add updatedAt timestamp (consider using Mongoose timestamps in schema for automation)
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updateData }, // $set ensures only provided fields are updated
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    // If findByIdAndUpdate returns null, it means the book was not found
    // (though getBookWithAuth should have caught this already)
    if (!updatedBook) {
        return NextResponse.json(
            { error: 'Book not found for update' },
            { status: 404 }
        );
    }

    return NextResponse.json({
      message: 'Book updated',
      book: updatedBook
    });
  } catch (err: any) {
    console.error('PUT error:', err);
    // Mongoose validation errors will have a 'name' property of 'ValidationError'
    if (err.name === 'ValidationError') {
        return NextResponse.json(
            { error: 'Validation failed', details: err.message },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[bookId]
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

  const { userId } = authResult;
  // FIX: Access params and cast bookId to string
  const { bookId } = await context.params; 

  // Get book with authorization (ensures user owns the book before deleting)
  const bookResult = await getBookWithAuth(bookId, userId);
  if (bookResult.error) {
    return NextResponse.json(
      { error: bookResult.error },
      { status: bookResult.status }
    );
  }

  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    
    // If findByIdAndDelete returns null, it means the book was not found
    // (though getBookWithAuth should have caught this already)
    if (!deletedBook) {
        return NextResponse.json(
            { error: 'Book not found for deletion' },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: 'Book deleted' });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json(
      { error: 'Internal error', details: err.message },
      { status: 500 }
    );
  }
}
