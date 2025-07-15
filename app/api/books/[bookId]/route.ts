import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Authenticates the user using JWT stored in cookies
async function authenticateUser(request: NextRequest): Promise<
  { error: string; status: number } | { userId: string }
> {
  const token = request.cookies.get('token')?.value;

  if (!token) return { error: 'Unauthorized: No token provided', status: 401 };
  if (!JWT_SECRET) return { error: 'Server configuration error', status: 500 };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    if (!decoded.userId) return { error: 'Invalid token: Missing user ID', status: 403 };
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) return { error: 'Invalid user ID in token', status: 403 };
    return { userId: decoded.userId };
  } catch (err) {
    console.error('Token verification failed:', err);
    return { error: 'Invalid or expired token', status: 403 };
  }
}

// 📚 Validates book ownership & existence for secure access
async function getBookWithAuth(bookId: string, userId: string) {
  if (!mongoose.Types.ObjectId.isValid(bookId)) return { error: 'Invalid Book ID', status: 400 };
  try {
    const book = await Book.findById(bookId);
    if (!book) return { error: 'Book not found', status: 404 };
    if (book.userId.toString() !== userId) return { error: 'Unauthorized: Not your book', status: 403 };
    return { book };
  } catch (err: any) {
    console.error('Database error in getBookWithAuth:', err);
    return { error: 'Internal error', status: 500 };
  }
}

// 📘 GET - Fetch single book by ID with auth
export async function GET(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const authResult = await authenticateUser(request);
    if ('error' in authResult) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const { bookId } = await context.params;
    const bookResult = await getBookWithAuth(bookId, authResult.userId);
    if ('error' in bookResult) return NextResponse.json({ error: bookResult.error }, { status: bookResult.status });

    return NextResponse.json(bookResult.book);
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

// ✏️ PUT - Full update (replaces all book fields)
export async function PUT(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const authResult = await authenticateUser(request);
    if ('error' in authResult) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const { bookId } = await context.params;
    const bookResult = await getBookWithAuth(bookId, authResult.userId);
    if ('error' in bookResult) return NextResponse.json({ error: bookResult.error }, { status: bookResult.status });

    const body = await request.json();
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    const updatedBook = await Book.findByIdAndUpdate(bookId, { $set: updateData }, { new: true, runValidators: true });

    if (!updatedBook) return NextResponse.json({ error: 'Book not found for update' }, { status: 404 });
    return NextResponse.json({ message: 'Book updated', book: updatedBook });
  } catch (err: any) {
    console.error('PUT error:', err);
    if (err.name === 'ValidationError') return NextResponse.json({ error: 'Validation failed', details: err.message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

// 🗑️ DELETE - Remove book by ID after auth & ownership check
export async function DELETE(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const authResult = await authenticateUser(request);
    if ('error' in authResult) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const { bookId } = await context.params;
    const bookResult = await getBookWithAuth(bookId, authResult.userId);
    if ('error' in bookResult) return NextResponse.json({ error: bookResult.error }, { status: bookResult.status });

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) return NextResponse.json({ error: 'Book not found for deletion' }, { status: 404 });
    return NextResponse.json({ message: 'Book deleted' });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Internal error', details: err.message }, { status: 500 });
  }
}

// 🔧 PATCH - Partial update (only changed fields)
export async function PATCH(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const authResult = await authenticateUser(request);
    if ('error' in authResult) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

    const { bookId } = await context.params;
    const bookResult = await getBookWithAuth(bookId, authResult.userId);
    if ('error' in bookResult) return NextResponse.json({ error: bookResult.error }, { status: bookResult.status });

    const updates = await request.json();
    updates.updatedAt = new Date().toISOString();

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedBook) return NextResponse.json({ error: 'Book not found for update' }, { status: 404 });
    return NextResponse.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (err: any) {
    console.error('PATCH error:', err);
    if (err.name === 'ValidationError') return NextResponse.json({ error: 'Validation failed', details: err.message }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
