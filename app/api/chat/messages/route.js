import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDB } from '../../../../lib/mongo';
import Message from '../../../../models/message';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');
    
    if (!otherUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDB();

    // Fetch messages between the current user and the other user
    const messages = await Message.find({
      $or: [
        { senderId: session.user.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.userId }
      ]
    }).sort({ timestamp: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, receiverId, receiverType } = body;

    if (!text || !receiverId || !receiverType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();

    // Create new message
    const message = await Message.create({
      text,
      senderId: session.user.userId,
      senderType: session.user.role,
      receiverId,
      receiverType,
      timestamp: new Date()
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 