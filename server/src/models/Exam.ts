import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  title: string;
  domain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
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
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswerIndex: { type: Number, required: true }
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
