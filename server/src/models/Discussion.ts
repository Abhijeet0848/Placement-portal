import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscussion extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  category: 'General' | 'Interview' | 'Job' | 'Official';
  replies: {
    authorId: mongoose.Types.ObjectId;
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

const DiscussionSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  category: { type: String, enum: ['General', 'Interview', 'Job', 'Official'], default: 'General' },
  replies: [
    {
      authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      authorName: { type: String, required: true },
      authorRole: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
