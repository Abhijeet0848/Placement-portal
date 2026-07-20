import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  salary: number; // LPA
  requirements: {
    minCGPA: number;
    branches: string[];
    skills: string[];
  };
  postedBy: mongoose.Types.ObjectId;
  applicantsCount: number;
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number, required: true },
  requirements: {
    minCGPA: { type: Number, default: 0 },
    branches: { type: [String], default: [] },
    skills: { type: [String], default: [] }
  },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  applicantsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJob>('Job', JobSchema);
