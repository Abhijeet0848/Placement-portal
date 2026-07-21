import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: string;
  action: string;
  timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
