import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import User from '../models/User';
import Notification from '../models/Notification';
import { isMockDb } from '../config/dbConnect';
import { mockDb } from '../db/mockDb';
import logger from '../utils/logger';

export const broadcastNotice = async (req: AuthenticatedRequest, res: Response) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required.' });
  }

  try {
    if (isMockDb) {
      // Find all students
      const students = mockDb.users.filter(u => u.role === 'Student');
      
      students.forEach(student => {
        const notif = {
          _id: 'notif_' + Math.random().toString(36).substr(2, 9),
          userId: student._id,
          title,
          message,
          read: false,
          createdAt: new Date()
        };
        mockDb.notifications.push(notif);
      });

      return res.status(200).json({ message: `Broadcast sent to ${students.length} students successfully.` });
    } else {
      const students = await User.find({ role: 'Student' });

      const notifications = students.map(student => ({
        userId: student._id,
        title,
        message,
        read: false
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      return res.status(200).json({ message: `Broadcast sent to ${students.length} students successfully.` });
    }
  } catch (error: any) {
    logger.error(`Broadcast notice failed: ${error.message}`);
    return res.status(500).json({ message: 'Failed to broadcast notice.' });
  }
};
