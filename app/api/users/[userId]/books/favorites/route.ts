import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import User from '@/models/User';

export async function GET(request: NextRequest, context: any) {
  try {
    await connectToDB();
    
    const { userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const query = { 
      userId: userId, 
      favorite: true 
    };

    let booksQuery = Book.find(query).sort({ updatedAt: -1 });
    
    if (limit) {
      booksQuery = booksQuery.limit(parseInt(limit));
    }

    const favoriteBooks = await booksQuery.exec();
    const totalCount = await Book.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: favoriteBooks,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}