import logger from '../utils/logger.js';

/**
 * Typing Indicator Socket Handler
 */
export const setupTypingSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    // User started typing
    socket.on('typing_start', (data) => {
      const { conversationId, recipientId } = data;

      io.to(`user_${recipientId}`).emit('user_typing_start', {
        userId,
        conversationId,
      });

      logger.debug(`User ${userId} started typing in ${conversationId}`);
    });

    // User stopped typing
    socket.on('typing_stop', (data) => {
      const { conversationId, recipientId } = data;

      io.to(`user_${recipientId}`).emit('user_typing_stop', {
        userId,
        conversationId,
      });

      logger.debug(`User ${userId} stopped typing in ${conversationId}`);
    });
  });
};

export default setupTypingSocket;

