import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDB } from '../../../../lib/mongo';
import Counselor from '../../../../models/counselor';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'counselor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    await connectToDB();

    // Find the counselor and get their students in conversation
    const counselor = await Counselor.findOne({email});
    console.log(counselor)
    if (!counselor) {
      return NextResponse.json({ error: 'Counselor not found' }, { status: 404 });
    }

    // Return the students in conversation
    if(!counselor.studentsInConversation || counselor.studentsInConversation.length === 0) {
      return NextResponse.json({ message: 'No students in conversation' }, { status: 200 });
    }
    return NextResponse.json(counselor.studentsInConversation);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 