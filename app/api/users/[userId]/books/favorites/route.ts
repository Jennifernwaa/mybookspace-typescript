import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await connectToDB();
    
    const { uid } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    // Check if user exists
    const user = await User.findById(uid);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build query for favorite books
    const query = { 
      userId: uid, 
      favorite: true 
    };

    let booksQuery = Book.find(query).sort({ updatedAt: -1 });
    
    if (limit) {
      booksQuery = booksQuery.limit(parseInt(limit));
    }

    const favoriteBooks = await booksQuery.exec();
    const totalCount = await Book.countDocuments(query);

    return NextResponse.json({
      books: favoriteBooks,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}