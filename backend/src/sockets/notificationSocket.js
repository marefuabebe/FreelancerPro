import Notification from '../models/notification.model.js';
import logger from '../utils/logger.js';

/**
 * Notification Socket Handler
 */
export const setupNotificationSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    // Join user's notification room
    socket.join(`notifications_${userId}`);

    // Get unread count
    socket.on('get_unread_count', async () => {
      try {
        const count = await Notification.countDocuments({
          recipient: userId,
          read: false,
        });

        socket.emit('unread_count', { count });
      } catch (error) {
        logger.error(`Get unread count error: ${error.message}`);
      }
    });

    // Mark notification as read
    socket.on('mark_notification_read', async (data) => {
      try {
        const { notificationId } = data;

        await Notification.findOneAndUpdate(
          { _id: notificationId, recipient: userId },
          { read: true, readAt: new Date() }
        );

        socket.emit('notification_read', { notificationId });
      } catch (error) {
        logger.error(`Mark notification read error: ${error.message}`);
      }
    });

    logger.info(`User ${userId} connected to notifications`);
  });
};

/**
 * Send notification to user
 */
export const sendNotification = (io, userId, notification) => {
  io.to(`notifications_${userId}`).emit('new_notification', notification);
};

export default setupNotificationSocket;

