import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDB } from '../../../../lib/mongo';
import Message from '../../../../models/message';
import Counselor from '../../../../models/counselor';
import User from '../../../../models/user';

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
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id }
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
    console.log(body)
    if (!text || !receiverId || !receiverType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();

    // If sender is a student and receiver is a counselor, add student to counselor's conversation list
    if (session.user.type === 'student' && receiverType === 'counselor') {
      const student = await User.findOne({ userId: session.user.id });
      const counselor = await Counselor.findOne({ name: receiverId });
      console.log(`User: ${student}, Counselor: ${counselor}`);

      if (student && counselor) {
        try {
          // Initialize studentsInConversation if it doesn't exist
          if (!counselor.studentsInConversation) {
            counselor.studentsInConversation = [];
          }

          // Check if student is already in conversation list
          const studentExists = counselor.studentsInConversation.some(
            s => s.studentId === student.userId
          );

          if (!studentExists) {
            counselor.studentsInConversation.push({
              studentId: student.userId,
              lastMessage: new Date()
            });
            await counselor.save();
          }
          console.log(counselor)
        } catch (error) {
          console.error('Error saving counselor:', error);
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
      }
    }


    // Create new message
    const message = await Message.create({
      text,
      senderId: session.user.id,
      senderType: session.user.type,
      receiverId,
      receiverType,
      timestamp: new Date()
    });

    console.log(message)
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 