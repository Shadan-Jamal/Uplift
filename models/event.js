import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    venue: {
        type: String,
        required: [true, 'Event venue is required'],
        trim: true
    },
    poster: {
        type: String, // URL to the stored image
    },
    image: {
        type: String, // Base64 encoded image data
        required: false
    },
    imageType: {
        type: String, // MIME type of the image (e.g., 'image/jpeg', 'image/png')
        required: false
    },
    link: {
        type: [String],
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true , collection: 'events'});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event; 