import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Affirmation text is required'],
    trim: true,
    maxlength: [500, 'Affirmation text cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true, collection: 'affirmations'});

const Affirmation = mongoose.models.Affirmation || mongoose.model('Affirmation', affirmationSchema);

export default Affirmation;

