import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  jobId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  meetLink: string;
  score?: {
    confidence: number;
    communication: number;
    technicalAccuracy: number;
    feedback: string;
  };
  createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  meetLink: { type: String, default: 'https://meet.jit.si/PlacementPortal-default' },
  score: {
    confidence: { type: Number },
    communication: { type: Number },
    technicalAccuracy: { type: Number },
    feedback: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
