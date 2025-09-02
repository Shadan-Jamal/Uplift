import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectToDB } from '../../../lib/mongo';
import Report from '../../../models/report';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'counselor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin
    if (session.user.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN) {
      return NextResponse.json({ error: 'Access denied. Super admin only.' }, { status: 403 });
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get reports with pagination
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalReports = await Report.countDocuments(query);

    // Get summary statistics
    const stats = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      pending: 0,
      reviewed: 0,
      resolved: 0,
      dismissed: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    return NextResponse.json({
      reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReports / limit),
        totalReports,
        hasNextPage: page * limit < totalReports,
        hasPrevPage: page > 1
      },
      stats: statusCounts
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'counselor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin
    if (session.user.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN) {
      return NextResponse.json({ error: 'Access denied. Super admin only.' }, { status: 403 });
    }

    const body = await request.json();
    const { reportId, status, reviewNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();

    const updateData = {
      status,
      reviewedBy: session.user.email,
      reviewedAt: new Date()
    };

    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      updateData,
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    console.log(updatedReport)
    return NextResponse.json({
      message: 'Report updated successfully',
      report: updatedReport
    });

  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
