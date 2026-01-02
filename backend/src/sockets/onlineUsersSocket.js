import User from '../models/user.model.js';
import logger from '../utils/logger.js';

const onlineUsers = new Map(); // userId -> socketId

/**
 * Online Users Socket Handler
 */
export const setupOnlineUsersSocket = (io) => {
  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();

    // Add user to online users
    onlineUsers.set(userId, socket.id);

    // Update user status in database
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
      });
    } catch (error) {
      logger.error(`Update online status error: ${error.message}`);
    }

    // Broadcast user is online to ALL clients (including sender)
    io.emit('user_online', { userId });

    // Send current online users to the newly connected user
    const onlineUserIds = Array.from(onlineUsers.keys());
    socket.emit('online_users', onlineUserIds);

    console.log(`👥 User ${userId} connected. Online users:`, onlineUserIds);

    logger.info(`User ${userId} is now online. Total online: ${onlineUsers.size}`);

    // Handle disconnect
    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);

      // Update user status
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
      } catch (error) {
        logger.error(`Update offline status error: ${error.message}`);
      }

      // Broadcast user is offline to ALL clients
      io.emit('user_offline', { userId });

      console.log(`👋 User ${userId} disconnected. Remaining online:`, Array.from(onlineUsers.keys()));

      logger.info(`User ${userId} is now offline`);
    });

    // Get online status
    socket.on('check_online_status', (data) => {
      const { userId: checkUserId } = data;
      const isOnline = onlineUsers.has(checkUserId);

      socket.emit('online_status', {
        userId: checkUserId,
        isOnline,
      });
    });
  });
};

/**
 * Get online users count
 */
export const getOnlineUsersCount = () => {
  return onlineUsers.size;
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};

export default setupOnlineUsersSocket;

