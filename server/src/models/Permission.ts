import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  role: string;
  permissions: {
    [key: string]: boolean;
  };
}

const PermissionSchema: Schema = new Schema({
  role: { type: String, required: true, unique: true },
  permissions: { type: Map, of: Boolean, default: {} }
}, { timestamps: true });

export default mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);
