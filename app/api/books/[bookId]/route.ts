import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import mongoose from 'mongoose';

// GET /api/books/[bookId] - Get a single book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    await connectToDB();
    const { bookId } = params;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json({ error: 'Valid Book ID is required' }, { status: 400 });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/books/[bookId] - Update a single book by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    await connectToDB();
    const { bookId } = params;
    const updates = await request.json();

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json({ error: 'Valid Book ID is required' }, { status: 400 });
    }

    // Ensure that userId cannot be changed via this route
    if (updates.userId) {
      delete updates.userId;
    }

    // Update 'updatedAt' timestamp manually if not using Mongoose's built-in timestamps
    // If timestamps: true is set in schema, Mongoose handles this automatically.
    // If you explicitly set timestamps: false, then you might need to handle it here:
    // updates.updatedAt = new Date().toISOString(); 

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updates },
      { new: true, runValidators: true } // Return updated doc, run schema validators
    );

    if (!updatedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error: any) {
    console.error('Error updating book:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/books/[bookId] - Delete a single book by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    await connectToDB();
    const { bookId } = params;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json({ error: 'Valid Book ID is required' }, { status: 400 });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
