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
    let otherUserId = searchParams.get('email');
    if (!otherUserId) {
      otherUserId = searchParams.get('userId');
    }
    if (!otherUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectToDB();

    // Find the conversation between the current user and the other user
    const conversation = await Message.findOne({
      $or: [
        { studentId: session.user.id, facultyId: otherUserId },
        { studentId: otherUserId, facultyId: session.user.email }
      ]
    });

    if (!conversation) {
      return NextResponse.json({ conversation: [] });
    }

    return NextResponse.json(conversation.conversation);
    
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
    console.log(session?.user)
    // Determine student and faculty IDs based on user types
    const studentId = session.user.type === 'student' ? session.user.id : receiverId;
    const facultyId = session.user.type === 'counselor' ? session.user.email : receiverId;

    // If sender is a student and receiver is a counselor, add student to counselor's conversation list
    if (session.user.type === 'student' && receiverType === 'counselor') {
      const student = await User.findOne({ userId: session.user.id });
      const counselor = await Counselor.findOne({ email: receiverId });

      if (student && counselor) {
        try {
          if (!counselor.studentsInConversation) {
            counselor.studentsInConversation = [];
          }

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
        } catch (error) {
          console.error('Error saving counselor:', error);
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
      }
    }

    // Find or create conversation document
    const conversation = await Message.findOneAndUpdate(
      { studentId, facultyId },
      {
        $push: {
          conversation: {
            text,
            senderId : session.user.type === 'student' ? session.user.id : session.user.email,
            timestamp: new Date()
          }
        },
        $set: { lastMessage: new Date() }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(conversation.conversation[conversation.conversation.length - 1]);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 