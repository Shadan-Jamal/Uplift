import { NextResponse } from 'next/server';
import {connectToDB} from "../../../../../lib/mongo";
import Message from '../../../../../models/message';

export async function POST(request) {
  try {
    const { studentId, facultyId } = await request.json();

    if (!studentId || !facultyId) {
      return NextResponse.json(
        { error: 'Student ID and Faculty ID are required' },
        { status: 400 }
      );
    }

    await connectToDB();

    // Update all unread messages in the conversation to read
    const result = await Message.updateOne(
      { studentId, facultyId },
      { 
        $set: { 
          'conversation.$[].read': true 
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No messages found or no messages were updated' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 