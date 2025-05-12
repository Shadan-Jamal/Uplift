import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectToDB } from '../../../../lib/mongo';
import User from '../../../../models/user';
import { sendReportEmail } from '../../../../lib/email';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'counselor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, reason } = body;

    if (!studentId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();

    // Get student's email
    const student = await User.findOne({ userId: studentId });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Send email to counselor
    try {
      await sendReportEmail({
        counselorEmail: session.user.email,
        studentId: studentId,
        studentEmail: student.email,
        reason: reason
      });

      return NextResponse.json({
        message: 'Report sent successfully via email',
        details: {
          studentId,
          studentEmail: student.email,
          counselorEmail: session.user.email
        }
      });
    } catch (emailError) {
      console.error('Error sending report email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send report email',
        details: emailError.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'counselor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    // Get all reports made by this counselor
    const reports = await Report.find({ reportedBy: session.user.email })
      .sort({ createdAt: -1 });

    return NextResponse.json(reports);

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 