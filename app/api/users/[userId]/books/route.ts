import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Book from '@/models/Book';
import User from '@/models/User';

export async function GET(request: NextRequest, context: any) {
  try {
    await connectToDB();
    const { userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const query: any = { userId: userId };
    if (status) query.status = status;

    const pipeline: any[] = [
      { $match: query },
      { $sort: { updatedAt: -1 } }
    ];

    if (limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });
    }

    const books = await Book.aggregate(pipeline);
    const totalCount = await Book.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: books,
      totalCount,
      currentPage: parseInt(page),
      totalPages: limit ? Math.ceil(totalCount / parseInt(limit)) : 1
    });
  } catch (error) {
    console.error('Error fetching user books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const { userId } = await context.params;
    const body = await request.json();

    await connectToDB();

    const newBook = new Book({
      ...body,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newBook.save();

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}