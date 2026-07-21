import mongoose, { Schema, Document } from 'mongoose';

export interface IBlacklistedToken extends Document {
  token: string;
  createdAt: Date;
}

const BlacklistedTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // Automatically delete after 7 days
});

export default mongoose.model<IBlacklistedToken>('BlacklistedToken', BlacklistedTokenSchema);
