import { NextResponse } from 'next/server';
import {connectToDB} from "../../../../lib/mongo.js";
import Affirmation from '../../../../models/affirmation';

export async function GET() {
  try {
    await connectToDB();
    
    const affirmations = await Affirmation.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('text createdAt'); // Only select the fields we need
    
    return NextResponse.json(affirmations, { status: 200 });
  } catch (error) {
    console.error('Error fetching affirmations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affirmations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Affirmation text is required' },
        { status: 400 }
      );
    }

    await connectToDB();
    
    const affirmation = await Affirmation.create({
      text,
      createdAt: new Date()
    });
    
    return NextResponse.json(affirmation, { status: 201 });
  } catch (error) {
    console.error('Error creating affirmation:', error);
    return NextResponse.json(
      { error: 'Failed to create affirmation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Affirmation ID is required' },
        { status: 400 }
      );
    }

    await connectToDB();
    
    const deletedAffirmation = await Affirmation.findByIdAndDelete(id);
    
    if (!deletedAffirmation) {
      return NextResponse.json(
        { error: 'Affirmation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Affirmation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting affirmation:', error);
    return NextResponse.json(
      { error: 'Failed to delete affirmation' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, text } = await request.json();
    
    if (!id || !text) {
      return NextResponse.json(
        { error: 'Affirmation ID and text are required' },
        { status: 400 }
      );
    }

    await connectToDB();
    
    const updatedAffirmation = await Affirmation.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    
    if (!updatedAffirmation) {
      return NextResponse.json(
        { error: 'Affirmation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedAffirmation, { status: 200 });
  } catch (error) {
    console.error('Error updating affirmation:', error);
    return NextResponse.json(
      { error: 'Failed to update affirmation' },
      { status: 500 }
    );
  }
} 