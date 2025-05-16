import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDB } from '../../../../lib/mongo';
import Message from '../../../../models/message';
import Counselor from '../../../../models/counselor';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDB();

    // Get counselor's students in conversation
    const counselor = await Counselor.findOne({ email });
    if (!counselor || !counselor.studentsInConversation) {
      return NextResponse.json({ message: 'No conversations yet' });
    }

    // Get all conversations for these students
    const conversations = await Message.find({
      facultyId: email,
      studentId: { $in: counselor.studentsInConversation.map(s => s.studentId) }
    });

    // Create a map of student conversations
    const conversationMap = {};
    conversations.forEach(conv => {
      conversationMap[conv.studentId] = conv;
    });

    // Format the response with conversation details
    const studentsWithMessages = counselor.studentsInConversation.map(student => {
      const conversation = conversationMap[student.studentId];
      const lastMessage = conversation?.conversation[conversation.conversation.length - 1];
      
      // Count unread messages (messages not read by the counselor)
      const unreadCount = conversation?.conversation.filter(msg => 
        msg.senderId === student.studentId && !msg.read
      ).length || 0;

      return {
        studentId: student.studentId,
        lastMessageTime: conversation?.lastMessage || student.lastMessage,
        lastMessage: lastMessage?.text || null,
        unreadCount,
        conversationId: conversation?._id
      };
    });

    // Sort by last message time
    studentsWithMessages.sort((a, b) => 
      new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
    );

    return NextResponse.json(studentsWithMessages);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 