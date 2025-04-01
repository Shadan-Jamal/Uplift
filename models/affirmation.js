import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true, collection: 'affirmations'});

const Affirmation = mongoose.models.Affirmation || mongoose.model('Affirmation', affirmationSchema);

export default Affirmation;

