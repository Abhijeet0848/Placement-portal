import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  company: string;
  studentId: mongoose.Types.ObjectId;
  rating: number; // 1-5
  salary: number; // LPA
  difficulty: number; // 1-5
  title: string;
  content: string;
  interviewProcess: string;
  tips: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  company: { type: String, required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  salary: { type: Number, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  content: { type: String, required: true },
  interviewProcess: { type: String, required: true },
  tips: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', ReviewSchema);
