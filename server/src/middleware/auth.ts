import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import BlacklistedToken from '../models/BlacklistedToken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin';
    name: string;
  };
}

export function generateTokens(user: { id: string; email: string; role: string; name: string }) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export async function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      if (isMockDb) {
        if (mockDb.blacklistedTokens.includes(token)) {
          return res.status(401).json({ message: 'Token is blacklisted' });
        }
      } else {
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
          return res.status(401).json({ message: 'Token is blacklisted' });
        }
      }

      jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: 'Token is invalid or expired' });
        }

        // Check if user was blocked mid-session
        if (isMockDb) {
          const u = mockDb.users.find((u: any) => u._id.toString() === decoded.id);
          if (u && u.status === 'Blocked') {
            return res.status(403).json({ message: 'Your account has been suspended.' });
          }
        } else {
          const u = await User.findById(decoded.id);
          if (u && u.status === 'Blocked') {
            return res.status(403).json({ message: 'Your account has been suspended.' });
          }
        }

        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        };
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error verifying token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header is missing' });
  }
}

export function requireRole(allowedRoles: ('Student' | 'Recruiter' | 'PlacementOfficer' | 'Admin')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User session not found' });
    }

    // Admin should access everything (Global Override)
    if (req.user.role === 'Admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}
