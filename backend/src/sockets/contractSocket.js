import logger from '../utils/logger.js';

/**
 * Contract Socket Handler - Real-time contract updates
 */
export const setupContractSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    // Join contract room
    socket.on('join_contract', (data) => {
      const { contractId } = data;
      socket.join(`contract_${contractId}`);
      logger.info(`User ${userId} joined contract room ${contractId}`);
    });

    // Leave contract room
    socket.on('leave_contract', (data) => {
      const { contractId } = data;
      socket.leave(`contract_${contractId}`);
      logger.info(`User ${userId} left contract room ${contractId}`);
    });

    // Contract updated
    socket.on('contract_updated', (data) => {
      const { contractId, update } = data;
      io.to(`contract_${contractId}`).emit('contract_update', {
        contractId,
        update,
        updatedBy: userId,
      });
    });

    // Milestone status changed
    socket.on('milestone_status_changed', (data) => {
      const { contractId, milestoneId, status } = data;
      io.to(`contract_${contractId}`).emit('milestone_status_update', {
        milestoneId,
        status,
        updatedBy: userId,
      });
    });
  });
};

/**
 * Broadcast contract update
 */
export const broadcastContractUpdate = (io, contractId, update) => {
  io.to(`contract_${contractId}`).emit('contract_update', update);
};

/**
 * Broadcast milestone update
 */
export const broadcastMilestoneUpdate = (io, contractId, milestone) => {
  io.to(`contract_${contractId}`).emit('milestone_update', milestone);
};

export default setupContractSocket;

