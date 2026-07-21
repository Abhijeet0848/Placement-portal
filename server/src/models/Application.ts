import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Selected';
  resumeUrl: string;
  matchScore: number;
  matchDetails: {
    matchedSkills: string[];
    missingSkills: string[];
    recommendation: string;
  };
  assessmentScore: number | null;
  appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'], default: 'Applied' },
  resumeUrl: { type: String, required: true },
  matchScore: { type: Number, default: 0 },
  matchDetails: {
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    recommendation: { type: String }
  },
  assessmentScore: { type: Number, default: null },
  appliedAt: { type: Date, default: Date.now }
});

// Avoid multiple applications by the same student for the same job
ApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
