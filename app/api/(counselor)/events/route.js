import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../lib/mongo';
import Event from '../../../../models/event';

// GET all events
export async function GET() {
  try {
    await connectToDB();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST new event
export async function POST(request) {
  try {
    const { title, description, venue, date, image, imageType } = await request.json();
    // Validate required fields
    if (!title || !description || !venue || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate image if provided
    if (image && imageType) {
      // Check if image is base64 encoded
      if (!image.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Invalid image format' },
          { status: 400 }
        );
      }

      // Check image size (base64 is about 33% larger than original)
      const base64Size = image.length;
      const estimatedOriginalSize = (base64Size * 3) / 4;
      if (estimatedOriginalSize > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        );
      }
    }

    await connectToDB();
    const event = await Event.create({
      title,
      description,
      venue,
      date,
      image: image || null,
      imageType: imageType || null,
    });

    return NextResponse.json(
      { event },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams)
    const id = searchParams.get('id');
    console.log("id is" + id)
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await connectToDB();
    const event = await Event.findByIdAndDelete(id);
    console.log("event is" + event)
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 