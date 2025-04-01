import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true,
        trim: true
    },
    poster: {
        type: String, // URL to the stored image
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true , collection: 'events'});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event; 