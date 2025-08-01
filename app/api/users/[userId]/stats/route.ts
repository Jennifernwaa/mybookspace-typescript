import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import User from '@/models/User';

export async function GET( request: NextRequest, context: any
) {
  try {
    await connectToDB();
    
    const { userId } = await context.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get current year
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    // Aggregate statistics
    const [
      totalBooksRead,
      booksThisYear,
      totalBooks,
      favoriteBooks,
      booksByStatus,
      readingStreak,
      topGenres
    ] = await Promise.all([
      // Total books read (finished)
      Book.countDocuments({ userId: userId, status: 'finished' }),
      
      // Books finished this year
      Book.countDocuments({ 
        userId: userId, 
        status: 'finished',
        finishedAt: { $gte: yearStart, $lte: yearEnd }
      }),
      
      // Total books in library
      Book.countDocuments({ userId: userId }),
      
      // Favorite books count
      Book.countDocuments({ userId: userId, favorite: true }),
      
      // Books by status
      Book.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Reading streak (simplified - books finished in last 30 days)
      Book.countDocuments({ 
        userId: userId, 
        status: 'finished',
        finishedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      
      // Top genres
      Book.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Get friends count
    const friendsCount = user.friends ? user.friends.length : 0;

    // Format status counts
    const statusCounts = booksByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Calculate reading goal progress
    const readingGoal = user.readingGoal || 50;
    const goalProgress = Math.min((booksThisYear / readingGoal) * 100, 100);

    // Recent activity (last 10 books)
    const recentActivity = await Book.find({ userId: userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('title author status updatedAt rating');

    const stats = {
      totalBooksRead,
      booksThisYear,
      totalBooks,
      favoriteBooks,
      friendsCount,
      readingStreak,
      readingGoal,
      goalProgress: Math.round(goalProgress),
      statusCounts: {
        finished: statusCounts.finished || 0,
        reading: statusCounts.reading || 0,
        'want-to-read': statusCounts['want-to-read'] || 0,
        'did-not-finish': statusCounts['did-not-finish'] || 0,
      },
      topGenres: topGenres.map(genre => ({
        name: genre._id,
        count: genre.count
      })),
      recentActivity: recentActivity.map(book => ({
        id: book._id,
        title: book.title,
        author: book.author,
        status: book.status,
        rating: book.rating,
        updatedAt: book.updatedAt
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}