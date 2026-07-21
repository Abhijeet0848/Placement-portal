import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  title: string;
  domain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationInMinutes: number;
  startTime?: Date;
  endTime?: Date;
  isPrivateScreening: boolean;
  jobId?: mongoose.Types.ObjectId;
  questions: {
    questionText: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    marks: number;
    negativeMarks: number;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }[];
  codingChallenges: {
    title: string;
    description: string;
    starterCode: string;
    testCases: { input: string; output: string }[];
  }[];
}

const ExamSchema: Schema = new Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  durationInMinutes: { type: Number, default: 30 },
  startTime: { type: Date },
  endTime: { type: Date },
  isPrivateScreening: { type: Boolean, default: false },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  questions: [
    {
      questionText: { type: String, required: true },
      category: { type: String, default: 'General' },
      difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
      marks: { type: Number, default: 2 },
      negativeMarks: { type: Number, default: 0 },
      options: [{ type: String, required: true }],
      correctAnswerIndex: { type: Number, required: true },
      explanation: { type: String, default: '' }
    }
  ],
  codingChallenges: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      starterCode: { type: String, default: '' },
      testCases: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true }
        }
      ]
    }
  ]
});

export default mongoose.model<IExam>('Exam', ExamSchema);
