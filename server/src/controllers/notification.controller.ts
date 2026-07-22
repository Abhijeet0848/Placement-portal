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

export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      const notifications = mockDb.notifications
        .filter(n => n.userId.toString() === req.user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50);
      return res.json({ notifications });
    }

    const notifications = await Notification.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ notifications });
  } catch (error: any) {
    logger.error(`Error fetching notifications: ${error.message}`);
    return res.status(500).json({ message: 'Error fetching notifications' });
  }
}

export async function markNotificationRead(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    if (isMockDb) {
      const notif = mockDb.notifications.find(n => n._id === id && n.userId.toString() === req.user?.id);
      if (notif) notif.read = true;
      return res.json({ message: 'Notification marked as read' });
    }

    await Notification.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      { read: true }
    );
    return res.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    logger.error(`Error marking notification read: ${error.message}`);
    return res.status(500).json({ message: 'Error marking notification read' });
  }
}

export async function markAllNotificationsRead(req: AuthenticatedRequest, res: Response) {
  try {
    if (isMockDb) {
      mockDb.notifications.forEach(n => {
        if (n.userId.toString() === req.user?.id) {
          n.read = true;
        }
      });
      return res.json({ message: 'All notifications marked as read' });
    }

    await Notification.updateMany(
      { userId: req.user?.id, read: false },
      { read: true }
    );
    return res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    logger.error(`Error marking all notifications read: ${error.message}`);
    return res.status(500).json({ message: 'Error marking all notifications read' });
  }
}
