import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentResult extends Document {
  user: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  score: number;
  mcqScore: number;
  codingScore: number;
  timeTakenMinutes: number;
  percentile: number;
  aiFeedback: {
    skillAnalysis: Record<string, number>;
    companyReadiness: Record<string, 'Ready' | 'Needs Practice' | 'Not Ready'>;
    learningPath: string[];
    weakestTopic: string;
    strongestTopic: string;
  };
  submittedAt: Date;
}

const AssessmentResultSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  mcqScore: { type: Number, required: true },
  codingScore: { type: Number, required: true },
  timeTakenMinutes: { type: Number, required: true },
  percentile: { type: Number, default: 0 },
  aiFeedback: {
    skillAnalysis: { type: Map, of: Number },
    companyReadiness: { type: Map, of: String },
    learningPath: [{ type: String }],
    weakestTopic: { type: String },
    strongestTopic: { type: String }
  },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
