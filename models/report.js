import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  reportedBy: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  reviewNotes: {
    type: String,
    trim: true,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  collection: 'reports'
});

// Add indexes for efficient querying
reportSchema.index({ studentId: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
