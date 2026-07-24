import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Permission from '../models/Permission';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';
import { isMockDb } from '../config/dbConnect';
import User from '../models/User';
import ActivityLog from '../models/ActivityLog';
import { mockDb } from '../db/mockDb';
export const mockPermissions: any[] = [];

// Helper to log administrative actions
export async function logActivity(userId: string, action: string) {
  try {
    let userName = 'Unknown User';
    
    if (isMockDb) {
      const u = mockDb.users.find((u: any) => u._id.toString() === userId.toString());
      if (u) userName = u.name;
      mockDb.activityLogs.unshift({ user: userName, action, timestamp: new Date() });
    } else {
      const u = await User.findById(userId);
      if (u) userName = u.name;
      await ActivityLog.create({ user: userName, action });
    }
  } catch (error) {
    logger.error(`Failed to log activity: ${error}`);
  }
}

export async function getActivityLogs(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      return res.json({ logs: mockDb.activityLogs.slice(0, 50) });
    }
    const logs = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(50);
    return res.json({ logs });
  } catch (error) {
    logger.error(`Failed to fetch activity logs: ${error}`);
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}

export async function getPermissions(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      return res.json({ permissions: mockPermissions });
    }

    const permissions = await Permission.find({});
    return res.json({ permissions });
  } catch (error: any) {
    logger.error(`Get permissions failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Internal server error fetching permissions' });
  }
}

export async function updatePermissions(req: AuthenticatedRequest, res: Response) {
  try {
    const { role } = req.params;
    const { permissions } = req.body;

    if (!role || !permissions) {
      return res.status(400).json({ message: 'Role and permissions object required' });
    }

    if (isMockDb) {
      const existing = mockPermissions.find(p => p.role === role);
      if (existing) {
        existing.permissions = { ...existing.permissions, ...permissions };
      } else {
        mockPermissions.push({ role, permissions });
      }
      return res.json({ message: 'Permissions updated successfully', permissions: mockPermissions.find(p => p.role === role) });
    }

    let permDoc = await Permission.findOne({ role });
    if (!permDoc) {
      permDoc = new Permission({ role, permissions });
    } else {
      // Update existing map
      for (const [key, value] of Object.entries(permissions)) {
        permDoc.permissions.set(key, value as boolean);
      }
    }
    await permDoc.save();

    if (req.user?.id) {
      await logActivity(req.user.id, `Updated permissions for role: ${role}`);
    }
    return res.json({ message: 'Permissions updated successfully', permissions: permDoc });
  } catch (error: any) {
    logger.error(`Update permissions failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Internal server error updating permissions' });
  }
}

export async function createBackup(req: AuthenticatedRequest, res: Response) {
  try {
    let backupData: any = {};

    if (isMockDb) {
      backupData = {
        users: mockDb.users,
        permissions: mockPermissions
      };
    } else {
      // Dump real mongo data
      const users = await User.find({});
      const permissions = await Permission.find({});
      backupData = { users, permissions };
    }

    if (req.user?.id) {
      await logActivity(req.user.id, 'Backed up placement database successfully');
    }

    return res.json({ 
      message: 'Database backup created successfully',
      timestamp: new Date().toISOString(),
      data: backupData
    });
  } catch (error: any) {
    logger.error(`Backup creation failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Internal server error creating backup' });
  }
}

export async function restoreBackup(req: AuthenticatedRequest, res: Response) {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: 'Backup filename is required' });
    }

    const backupDir = path.join(__dirname, '../../backups');
    const backupFilePath = path.join(backupDir, filename);

    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }

    const fileContent = fs.readFileSync(backupFilePath, 'utf-8');
    const backupData = JSON.parse(fileContent);

    if (isMockDb) {
      mockDb.users = backupData.users || [];
      // Empty and repopulate mockPermissions to preserve reference
      mockPermissions.length = 0;
      if (backupData.permissions) {
        mockPermissions.push(...backupData.permissions);
      }
    } else {
      // Danger zone: Wipe and restore real DB
      await User.deleteMany({});
      await Permission.deleteMany({});
      
      if (backupData.users && backupData.users.length > 0) {
        await User.insertMany(backupData.users);
      }
      if (backupData.permissions && backupData.permissions.length > 0) {
        await Permission.insertMany(backupData.permissions);
      }
    }

    if (req.user?.id) {
      await logActivity(req.user.id, `Restored placement database from backup: ${filename}`);
    }

    return res.json({ message: 'Database successfully restored from backup' });
  } catch (error: any) {
    logger.error(`Backup restoration failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Internal server error restoring backup' });
  }
}

export async function updateUserStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: 'User ID and status are required' });
    }

    if (status !== 'Active' && status !== 'Blocked') {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (isMockDb) {
      const u = mockDb.users.find((u: any) => u._id.toString() === id.toString());
      if (!u) {
        return res.status(404).json({ message: 'User not found' });
      }
      u.status = status;
    } else {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.status = status;
      await user.save();
    }

    if (req.user?.id) {
      await logActivity(req.user.id, `Changed user ${id} status to ${status}`);
    }

    return res.json({ message: `User status successfully updated to ${status}` });
  } catch (error: any) {
    logger.error(`Update user status failed: ${error?.message || error}`);
    return res.status(500).json({ message: error?.message || 'Internal server error updating user status' });
  }
}
