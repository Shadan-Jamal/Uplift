import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDB } from '../../../../lib/mongo';
import Message from '../../../../models/message';
import User from '../../../../models/user';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'counselor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();
    const MessageModel = Message();

    // Find all unique students who have sent messages to this counselor
    const messages = await MessageModel.find({
      receiverId: session.user.userId,
      receiverType: 'counselor'
    }).distinct('senderId');

    // Fetch student details
    const students = await User.find({
      userId: { $in: messages },
      role: 'student'
    }).select('userId name email');

    console.log(students)
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 