import { Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import User from '../models/User';
import Permission from '../models/Permission';
import { generateTokens, AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { mockPermissions } from './admin.controller';
import BlacklistedToken from '../models/BlacklistedToken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey';

// 1. Sign Up
export async function register(req: AuthenticatedRequest, res: Response) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields (name, email, password, role) are required.' });
  }

  // Name validation
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Invalid name. Must be 2-50 characters and contain only letters and spaces.' });
  }


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.' });
  }

  // Strict email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  try {
    const salt = bcryptjs.genSaltSync(10);
    const passwordHash = bcryptjs.hashSync(password, salt);
    
    // Generate 6 digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    logger.info(`--- MOCK EMAIL ---`);
    logger.info(`To: ${email}`);
    logger.info(`Subject: Verify Your Email`);
    logger.info(`Your verification code is: ${verificationToken}`);
    logger.info(`------------------`);

    if (isMockDb) {
      // Mock DB path
      const userExists = mockDb.users.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email,
        passwordHash,
        role: role as any,
        status: 'Active' as const,
        profile: {
          skills: [],
          experience: [],
          projects: [],
          education: [],
          verified: false,
          certificates: [],
          verificationToken
        },
        createdAt: new Date()
      };

      mockDb.users.push(newUser);
      const tokens = generateTokens({ id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name });

      return res.status(201).json({
        message: 'Registration successful (Mock DB)',
        tokens,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile
        }
      });
    } else {
      // Real DB path
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const user = new User({
        name,
        email,
        passwordHash,
        role,
        profile: {
          skills: [],
          experience: [],
          projects: [],
          education: [],
          verified: false,
          certificates: [],
          verificationToken
        }
      });

      await user.save();
      const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });

      return res.status(201).json({
        message: 'Registration successful',
        tokens,
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
    logger.error(`Register failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server registration error' });
  }
}

// 2. Login
export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    if (isMockDb) {
      const user = mockDb.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      if (user.status === 'Blocked') {
        return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
      }

      const isMatch = bcryptjs.compareSync(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      // Fetch role permissions (Mock)
      const mockRolePerms = mockPermissions.find(p => p.role === user.role);
      const permissions = mockRolePerms ? mockRolePerms.permissions : {};

      const tokens = generateTokens({ id: user._id, email: user.email, role: user.role, name: user.name });
      return res.json({
        message: 'Login successful (Mock DB)',
        tokens,
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
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      if (user.status === 'Blocked') {
        return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
      }

      const isMatch = bcryptjs.compareSync(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      // Fetch role permissions
      const permDoc = await Permission.findOne({ role: user.role });
      const permissions = permDoc && permDoc.permissions ? Object.fromEntries(permDoc.permissions) : {};

      const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
      return res.json({
        message: 'Login successful',
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
    }
  } catch (error: any) {
    logger.error(`Login failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server login error' });
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
    return res.status(500).json({ message: 'Server refresh token error' });
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
    return res.status(500).json({ message: 'Server logout error' });
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
    return res.status(500).json({ message: 'Server profile fetch error' });
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

  if (phone !== undefined) {
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
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
    return res.status(500).json({ message: 'Server profile update error' });
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
    return res.status(500).json({ message: 'Server fetch students error' });
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
    return res.status(500).json({ message: 'Server fetch users error' });
  }
}

// In-memory reset tokens map for mock DB or fallback
const resetTokens: Record<string, { code: string; expires: number }> = {};

// 7. Forgot Password (Request OTP / Token)
export async function forgotPassword(req: AuthenticatedRequest, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email address is required.' });

  try {
    let userFound = false;
    if (isMockDb) {
      userFound = mockDb.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      const u = await User.findOne({ email: email.toLowerCase() });
      userFound = !!u;
    }

    if (!userFound) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate 6-digit OTP code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens[email.toLowerCase()] = {
      code: resetCode,
      expires: Date.now() + 15 * 60 * 1000 // 15 mins expiry
    };

    logger.info(`Password reset requested for ${email}. Reset code: ${resetCode}`);

    return res.json({
      message: `Reset code generated! Check your email or use code: ${resetCode}`,
      resetCode // Included for easy demo testing
    });
  } catch (error: any) {
    logger.error(`Forgot password error: ${error?.message || error}`);
    return res.status(500).json({ message: 'Failed to process forgot password request.' });
  }
}

// 8. Reset Password (Verify OTP & Set New Password)
export async function resetPassword(req: AuthenticatedRequest, res: Response) {
  const { email, code, newPassword, confirmPassword } = req.body;
  if (!email || !code || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Email, reset code, new password, and confirm password are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.' });
  }

  try {
    const record = resetTokens[email.toLowerCase()];
    if (!record || record.code !== code || record.expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset code. Please request a new one.' });
    }

    const salt = bcryptjs.genSaltSync(10);
    const passwordHash = bcryptjs.hashSync(newPassword, salt);

    if (isMockDb) {
      const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.passwordHash = passwordHash;
      }
    } else {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.passwordHash = passwordHash;
        await user.save();
      }
    }

    delete resetTokens[email.toLowerCase()];
    logger.info(`Password successfully reset for email: ${email}`);

    return res.json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error: any) {
    logger.error(`Reset password error: ${error?.message || error}`);
    return res.status(500).json({ message: 'Failed to reset password.' });
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
    return res.status(500).json({ message: 'Server delete student error' });
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
    return res.status(500).json({ message: 'Server student profile update error' });
  }
}

// 12. Verify Email
export async function verifyEmail(req: AuthenticatedRequest, res: Response) {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Verification code is required.' });
  }
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    if (isMockDb) {
      const user = mockDb.users.find(u => u._id === req.user?.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      if (user.profile.verificationToken === code) {
        user.profile.verified = true;
        user.profile.verificationToken = undefined;
        return res.json({ message: 'Email verified successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
    } else {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.profile.verificationToken === code) {
        user.profile.verified = true;
        user.profile.verificationToken = undefined;
        await user.save();
        return res.json({ message: 'Email verified successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
    }
  } catch (error: any) {
    logger.error(`Verify email failed: ${error?.message || error}`);
    return res.status(500).json({ message: 'Server verification error' });
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
    return res.status(500).json({ message: 'Server upload error' });
  }
}
