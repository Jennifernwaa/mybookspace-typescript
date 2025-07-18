import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
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
    const page = searchParams.get('page') || '1';

    const user = await User.findById(uid).populate('friends', 'userName email profilePicture lastActive');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let friends = user.friends || [];
    const totalCount = friends.length;

    if (limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      friends = friends.slice(skip, skip + parseInt(limit));
    }

    return NextResponse.json({
      friends,
      totalCount,
      currentPage: parseInt(page),
      totalPages: limit ? Math.ceil(totalCount / parseInt(limit)) : 1
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;
    const { friendId } = await request.json();

    await connectToDB();

    const friend = await User.findById(friendId);
    if (!friend) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(uid, { $addToSet: { friends: friendId } }, { new: true });
    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: uid } }, { new: true });

    return NextResponse.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;
    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get('friendId');

    if (!friendId) {
      return NextResponse.json({ error: 'Friend ID is required' }, { status: 400 });
    }

    await connectToDB();

    await User.findByIdAndUpdate(uid, { $pull: { friends: friendId } }, { new: true });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: uid } }, { new: true });

    return NextResponse.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}