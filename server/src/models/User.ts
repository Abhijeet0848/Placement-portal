import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin';
  status: 'Active' | 'Blocked';
  profile: {
    phone?: string;
    address?: string;
    cgpa?: number;
    cgpaScale?: string;
    branch?: string;
    skills: string[];
    experience: string[];
    projects: { title: string; description: string; url?: string }[];
    education: { institution: string; degree: string; year: string }[];
    resumeUrl?: string;
    resumeScore?: number;
    resumeAnalysis?: any;
    verified: boolean;
    certificates: { name: string; url: string; verified: boolean; issueDate: string }[];
    verificationToken?: string;
    avatarUrl?: string;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Recruiter', 'PlacementOfficer', 'Admin'], required: true },
  status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  profile: {
    phone: { type: String },
    address: { type: String },
    cgpa: { type: Number },
    cgpaScale: { type: String, default: '10.0' },
    branch: { type: String },
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        url: { type: String }
      }
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: { type: String, required: true }
      }
    ],
    resumeUrl: { type: String },
    resumeScore: { type: Number },
    resumeAnalysis: { type: Schema.Types.Mixed },
    verified: { type: Boolean, default: false },
    certificates: [
      {
        name: { type: String, required: true },
        url: { type: String },
        verified: { type: Boolean, default: false },
        issueDate: { type: String },
        uploadedAt: { type: String }
      }
    ],
    verificationToken: { type: String },
    avatarUrl: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
