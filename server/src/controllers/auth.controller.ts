import { Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import User from '../models/User';
import Permission from '../models/Permission';
import { generateTokens, AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { OAuth2Client } from 'google-auth-library';
import { mockPermissions } from './admin.controller';
import BlacklistedToken from '../models/BlacklistedToken';
import { sendEmail } from '../utils/email';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey';

const BANNED_EMAIL_DOMAINS = [
  'yahoo.com', 'yahoo.in', 'hotmail.com', 'outlook.com', 
  'aol.com', 'icloud.com', 'rediffmail.com', 'mail.com', 'protonmail.com'
];


// 1. Request OTP (Signup & Login)
export async function requestOtp(req: AuthenticatedRequest, res: Response) {
  const { email, role, name } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const domain = email.split('@')[1].toLowerCase();
  if (BANNED_EMAIL_DOMAINS.includes(domain)) {
    return res.status(400).json({ message: 'Personal email domains are not allowed. Please use your official university or company email.' });
  }

  try {
    const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const loginOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await sendEmail({
      to: email,
      subject: 'Your OTP - Smart Placement Portal',
      text: `Your OTP is: ${loginOtp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Your Login OTP</h2>
          <p>Please use the verification code below to proceed:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px; margin: 20px 0;">
            ${loginOtp}
          </div>
          <p><strong>Note:</strong> This code will expire in 15 minutes.</p>
        </div>
      `
    });

    if (isMockDb) {
      let user = mockDb.users.find(u => u.email === email);
      if (name && user) return res.status(400).json({ message: 'User with this email already exists.' });
      if (!name && !user) return res.status(400).json({ message: 'User not found. Please register first.' });
      if (user && user.role !== role) return res.status(400).json({ message: `This email is registered as a ${user.role}.` });

      if (!user && name) {
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        if (!nameRegex.test(name)) return res.status(400).json({ message: 'Invalid name.' });
        user = {
          _id: `usr_${Date.now()}`,
          name, email, passwordHash: '', role: role as any, status: 'Active' as const,
          profile: { skills: [], experience: [], projects: [], education: [], verified: false, certificates: [], loginOtp, loginOtpExpires },
          createdAt: new Date()
        };
        mockDb.users.push(user);
      } else if (user) {
        user.profile.loginOtp = loginOtp;
        user.profile.loginOtpExpires = loginOtpExpires;
      }
      return res.json({ message: 'OTP sent to your email.' });
    } else {
      let user = await User.findOne({ email });
      if (name && user) return res.status(400).json({ message: 'User with this email already exists.' });
      if (!name && !user) return res.status(400).json({ message: 'User not found. Please register first.' });
      if (user && user.role !== role) return res.status(400).json({ message: `This email is registered as a ${user.role}.` });

      if (!user && name) {
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        if (!nameRegex.test(name)) return res.status(400).json({ message: 'Invalid name.' });
        user = new User({
          name, email, passwordHash: '', role,
          profile: { skills: [], experience: [], projects: [], education: [], verified: false, certificates: [], loginOtp, loginOtpExpires }
        });
        await user.save();
      } else if (user) {
        user.profile.loginOtp = loginOtp;
        user.profile.loginOtpExpires = loginOtpExpires;
        await user.save();
      }
      return res.json({ message: 'OTP sent to your email.' });
    }
  } catch (error: any) {
    logger.error(`OTP request failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Failed to send OTP.' });
  }
}

// 2. Verify OTP
export async function verifyOtp(req: AuthenticatedRequest, res: Response) {
  const { email, otp, role } = req.body;
  if (!email || !otp || !role) return res.status(400).json({ message: 'Email, OTP, and role are required.' });

  try {
    if (isMockDb) {
      const user = mockDb.users.find(u => u.email === email && u.role === role);
      if (!user) return res.status(400).json({ message: 'Invalid request.' });
      if (user.status === 'Blocked') return res.status(403).json({ message: 'Account suspended.' });
      if (!user.profile.loginOtp || user.profile.loginOtp !== otp || !user.profile.loginOtpExpires || new Date(user.profile.loginOtpExpires).getTime() < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }
      user.profile.loginOtp = undefined;
      user.profile.loginOtpExpires = undefined;
      user.profile.verified = true;
      const mockRolePerms = mockPermissions.find(p => p.role === user.role);
      const permissions = mockRolePerms ? mockRolePerms.permissions : {};
      const tokens = generateTokens({ id: user._id, email: user.email, role: user.role, name: user.name });
      return res.json({
        message: 'Login successful', tokens,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile, permissions }
      });
    } else {
      const user = await User.findOne({ email, role });
      if (!user) return res.status(400).json({ message: 'Invalid request.' });
      if (user.status === 'Blocked') return res.status(403).json({ message: 'Account suspended.' });
      if (!user.profile.loginOtp || user.profile.loginOtp !== otp || !user.profile.loginOtpExpires || new Date(user.profile.loginOtpExpires).getTime() < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }
      user.profile.loginOtp = undefined;
      user.profile.loginOtpExpires = undefined;
      user.profile.verified = true;
      await user.save();
      const permDoc = await Permission.findOne({ role: user.role });
      const permissions = permDoc && permDoc.permissions ? Object.fromEntries(permDoc.permissions) : {};
      const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
      return res.json({
        message: 'Login successful', tokens,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, profile: user.profile, permissions }
      });
    }
  } catch (error: any) {
    logger.error(`OTP verify failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Failed to verify OTP.' });
  }
}
// 2.1 Google SSO Login
export async function googleLogin(req: AuthenticatedRequest, res: Response) {
  const { credential, role } = req.body;
  
  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required.' });
  }
  
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }
    
    const email = payload.email;
    const name = payload.name || 'Google User';
    
    const domain = email.split('@')[1].toLowerCase();
    if (BANNED_EMAIL_DOMAINS.includes(domain)) {
      return res.status(400).json({ message: 'Personal email domains are not allowed. Please use your official university or company email.' });
    }
    
    // Find or create user
    let user;
    if (isMockDb) {
      user = mockDb.users.find(u => u.email === email);
      if (!user) {
        user = {
          _id: `usr_google_${Date.now()}`,
          name,
          email,
          passwordHash: '',
          role: role || 'Student',
          status: 'Active' as const,
          profile: {
            skills: [], experience: [], projects: [], education: [],
            verified: true, certificates: [], avatarUrl: payload.picture
          },
          createdAt: new Date()
        };
        mockDb.users.push(user);
      }
    } else {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          passwordHash: '',
          role: role || 'Student',
          profile: {
            skills: [], experience: [], projects: [], education: [],
            verified: true, certificates: [], avatarUrl: payload.picture
          }
        });
        await user.save();
      }
    }
    
    if (role && user.role !== role) {
      return res.status(400).json({ message: `This email is registered as a ${user.role}. Please select the correct role to log in.` });
    }
    
    if (user.status === 'Blocked') {
      return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
    }
    
    let permissions = {};
    if (!isMockDb) {
      const permDoc = await Permission.findOne({ role: user.role });
      permissions = permDoc && permDoc.permissions ? Object.fromEntries(permDoc.permissions) : {};
    }
    
    const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
    return res.json({
      message: 'Google login successful',
      tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        permissions
      }
    });
  } catch (error: any) {
    logger.error(`Google login failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Google authentication failed' });
  }
}

// 2.2 Microsoft SSO Login
export async function microsoftLogin(req: AuthenticatedRequest, res: Response) {
  const { accessToken, role } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ message: 'Microsoft access token is required.' });
  }
  
  try {
    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!graphResponse.ok) {
      return res.status(400).json({ message: 'Invalid Microsoft token.' });
    }
    
    const profileData = await graphResponse.json() as any;
    const email = profileData.mail || profileData.userPrincipalName;
    const name = profileData.displayName || 'Microsoft User';
    
    if (!email) {
      return res.status(400).json({ message: 'Email not found in Microsoft profile.' });
    }
    
    const domain = email.split('@')[1].toLowerCase();
    if (BANNED_EMAIL_DOMAINS.includes(domain)) {
      return res.status(400).json({ message: 'Personal email domains are not allowed. Please use your official university or company email.' });
    }
    
    // Find or create user
    let user;
    if (isMockDb) {
      user = mockDb.users.find(u => u.email === email);
      if (!user) {
        user = {
          _id: `usr_ms_${Date.now()}`,
          name,
          email,
          passwordHash: '',
          role: role || 'Student',
          status: 'Active' as const,
          profile: {
             skills: [], experience: [], projects: [], education: [],
             verified: true, certificates: []
          },
          createdAt: new Date()
        };
        mockDb.users.push(user);
      }
    } else {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          passwordHash: '',
          role: role || 'Student',
          profile: {
            skills: [], experience: [], projects: [], education: [],
            verified: true, certificates: []
          }
        });
        await user.save();
      }
    }
    
    if (role && user.role !== role) {
      return res.status(400).json({ message: `This email is registered as a ${user.role}. Please select the correct role to log in.` });
    }
    
    if (user.status === 'Blocked') {
      return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
    }
    
    let permissions = {};
    if (!isMockDb) {
      const permDoc = await Permission.findOne({ role: user.role });
      permissions = permDoc && permDoc.permissions ? Object.fromEntries(permDoc.permissions) : {};
    }
    
    const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
    return res.json({
      message: 'Microsoft login successful',
      tokens,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        permissions
      }
    });
  } catch (error: any) {
    logger.error(`Microsoft login failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Microsoft authentication failed' });
  }
}

// 3. Refresh Token
export async function refreshToken(req: AuthenticatedRequest, res: Response) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    if (isMockDb) {
      if (mockDb.blacklistedTokens.includes(token)) {
        return res.status(403).json({ message: 'Refresh token is blacklisted.' });
      }
    } else {
      const isBlacklisted = await BlacklistedToken.findOne({ token });
      if (isBlacklisted) {
        return res.status(403).json({ message: 'Refresh token is blacklisted.' });
      }
    }

    jwt.verify(token, JWT_REFRESH_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh token is invalid or expired.' });
      }

      const tokens = generateTokens({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      });

      return res.json({
        tokens
      });
    });
  } catch (error: any) {
    logger.error(`Refresh token failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server refresh token error' });
  }
}

// 4. Logout
export async function logout(req: AuthenticatedRequest, res: Response) {
  const { refreshToken } = req.body;
  const authHeader = req.headers.authorization;
  const accessToken = authHeader ? authHeader.split(' ')[1] : null;

  try {
    if (isMockDb) {
      if (accessToken) mockDb.blacklistedTokens.push(accessToken);
      if (refreshToken) mockDb.blacklistedTokens.push(refreshToken);
    } else {
      if (accessToken) {
        await BlacklistedToken.create({ token: accessToken });
      }
      if (refreshToken) {
        await BlacklistedToken.create({ token: refreshToken });
      }
    }
    return res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    logger.error(`Logout failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server logout error' });
  }
}

// 5. Get Current Profile
export async function getProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    if (isMockDb) {
      const user = mockDb.users.find(u => u._id === req.user?.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const mockRolePerms = mockPermissions.find(p => p.role === user.role);
      const permissions = mockRolePerms ? mockRolePerms.permissions : {};
      return res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
          permissions
        }
      });
    } else {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const permDoc = await Permission.findOne({ role: user.role });
      const permissions = permDoc && permDoc.permissions ? Object.fromEntries(permDoc.permissions) : {};

      return res.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
          permissions
        }
      });
    }
  } catch (error: any) {
    logger.error(`Get profile failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server profile fetch error' });
  }
}

// 5. Update Profile
export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const { name, email, phone, address, cgpa, cgpaScale, branch, skills, experience, projects, education, resumeUrl, certificates } = req.body;

  if (name !== undefined) {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'Invalid name. Must be 2-50 characters and contain only letters and spaces.' });
    }
  }

  if (phone !== undefined && phone !== '') {
    const phoneRegex = /^\+?[\d\s\-\(\)\.]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }
  }

  if (experience !== undefined) {
    if (!Array.isArray(experience) || experience.some(exp => typeof exp !== 'string' || exp.length > 500)) {
      return res.status(400).json({ message: 'Experience must be an array of valid strings.' });
    }
  }

  try {
    if (isMockDb) {
      const userIndex = mockDb.users.findIndex(u => u._id === req.user?.id);
      if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

      if (name !== undefined) mockDb.users[userIndex].name = name;
      if (email !== undefined) mockDb.users[userIndex].email = email;

      const profile = mockDb.users[userIndex].profile;
      mockDb.users[userIndex].profile = {
        ...profile,
        phone: phone !== undefined ? phone : profile.phone,
        address: address !== undefined ? address : profile.address,
        cgpa: cgpa !== undefined ? Number(cgpa) : profile.cgpa,
        cgpaScale: cgpaScale !== undefined ? cgpaScale : (profile.cgpaScale || '10.0'),
        branch: branch !== undefined ? branch : profile.branch,
        skills: skills !== undefined ? skills : profile.skills,
        experience: experience !== undefined ? experience : profile.experience,
        projects: projects !== undefined ? projects : profile.projects,
        education: education !== undefined ? education : profile.education,
        resumeUrl: resumeUrl !== undefined ? resumeUrl : profile.resumeUrl,
        certificates: certificates !== undefined ? certificates : profile.certificates
      };

      return res.json({
        message: 'Profile updated successfully (Mock DB)',
        user: {
          id: mockDb.users[userIndex]._id,
          name: mockDb.users[userIndex].name,
          email: mockDb.users[userIndex].email,
          role: mockDb.users[userIndex].role,
          profile: mockDb.users[userIndex].profile
        }
      });
    } else {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (phone !== undefined) user.profile.phone = phone;
      if (address !== undefined) user.profile.address = address;
      if (cgpa !== undefined) user.profile.cgpa = Number(cgpa);
      if (cgpaScale !== undefined) user.profile.cgpaScale = cgpaScale;
      if (branch !== undefined) user.profile.branch = branch;
      if (skills !== undefined) user.profile.skills = skills;
      if (experience !== undefined) user.profile.experience = experience;
      if (projects !== undefined) user.profile.projects = projects;
      if (education !== undefined) user.profile.education = education;
      if (resumeUrl !== undefined) user.profile.resumeUrl = resumeUrl;
      if (certificates !== undefined) user.profile.certificates = certificates;

      await user.save();
      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    }
  } catch (error: any) {
    logger.error(`Update profile failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server profile update error' });
  }
}

// 6. Get All Students (For Recruiter and Placement Officer)
export async function getAllStudents(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      const students = mockDb.users
        .filter(u => u.role === 'Student')
        .map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          profile: u.profile
        }));
      return res.json({ students });
    } else {
      const users = await User.find({ role: 'Student' });
      const students = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        profile: u.profile
      }));
      return res.json({ students });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Server fetch students error' });
  }
}

// 6.1 Get All Users (For Admin)
export async function getAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      const users = mockDb.users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        profile: u.profile
      }));
      return res.json({ users });
    } else {
      const dbUsers = await User.find({});
      const users = dbUsers.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        profile: u.profile
      }));
      return res.json({ users });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Server fetch users error' });
  }
}

// 9. Delete Student (For Placement Officer / Admin)
export async function deleteStudent(req: AuthenticatedRequest, res: Response) {
  try {
    const studentId = req.params.id;
    if (isMockDb) {
      const index = mockDb.users.findIndex(u => u._id === studentId && u.role === 'Student');
      if (index === -1) {
        return res.status(404).json({ message: 'Student not found' });
      }
      mockDb.users.splice(index, 1);
      return res.json({ message: 'Student deleted successfully (Mock DB)' });
    } else {
      const deletedUser = await User.findOneAndDelete({ _id: studentId, role: 'Student' });
      if (!deletedUser) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json({ message: 'Student deleted successfully' });
    }
  } catch (error: any) {
    logger.error(`Delete student failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server delete student error' });
  }
}

// 10. Update Student Profile (For Placement Officer / Admin)
export async function updateStudentProfile(req: AuthenticatedRequest, res: Response) {
  const studentId = req.params.id;
  const { certificates } = req.body;

  try {
    if (isMockDb) {
      const userIndex = mockDb.users.findIndex(u => u._id === studentId && u.role === 'Student');
      if (userIndex === -1) return res.status(404).json({ message: 'Student not found' });

      const profile = mockDb.users[userIndex].profile;
      mockDb.users[userIndex].profile = {
        ...profile,
        certificates: certificates !== undefined ? certificates : profile.certificates
      };

      return res.json({
        message: 'Student profile updated successfully (Mock DB)',
        profile: mockDb.users[userIndex].profile
      });
    } else {
      const user = await User.findOne({ _id: studentId, role: 'Student' });
      if (!user) return res.status(404).json({ message: 'Student not found' });

      if (certificates !== undefined) user.profile.certificates = certificates;

      await user.save();
      return res.json({
        message: 'Student profile updated successfully',
        profile: user.profile
      });
    }
  } catch (error: any) {
    logger.error(`Update student profile failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server student profile update error' });
  }
}

// 13. Upload Profile Picture
export async function uploadProfilePicture(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }

  try {
    // In a real app we'd upload to S3/Cloudinary and get a URL.
    // For now, we simulate success and return a mock URL.
    const avatarUrl = `https://mock-storage.com/avatars/${req.user.id}-${Date.now()}.png`;

    if (isMockDb) {
      const user = mockDb.users.find(u => u._id === req.user?.id);
      if (user) {
        user.profile.avatarUrl = avatarUrl;
      }
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { 'profile.avatarUrl': avatarUrl }
      });
    }

    return res.json({ message: 'Profile picture uploaded successfully', avatarUrl });
  } catch (error: any) {
    logger.error(`Upload profile picture failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Server upload error' });
  }
}
