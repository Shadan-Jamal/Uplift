import { NextResponse } from 'next/server';
import { connectToDB } from '../../../lib/mongo';
import Screening from '../../../models/Screening';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { score, level, answers } = await request.json();

    if (!score || !level || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDB();

    const screening = await Screening.create({
      userId: session.user.id,
      email: session.user.email,
      score,
      level,
      answers
    });

    return NextResponse.json(screening, { status: 201 });
  } catch (error) {
    console.error('Error submitting screening:', error);
    return NextResponse.json(
      { error: 'Failed to submit screening' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();

    const screenings = await Screening.find({ userId: session.user.id })
      .sort({ timestamp: -1 });

    return NextResponse.json(screenings);
  } catch (error) {
    console.error('Error fetching screenings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screenings' },
      { status: 500 }
    );
  }
} 