import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import logger from '../utils/logger.js';

/**
 * Notification Service
 */
class NotificationService {
  constructor() {
    this.io = null;
  }

  /**
   * Set socket.io instance
   */
  setIO(io) {
    this.io = io;
    logger.info('Socket.io instance set in NotificationService');
  }

  /**
   * Create notification
   */
  async createNotification({
    recipient,
    sender,
    type,
    title,
    message,
    relatedTo,
    link,
    actionRequired = false,
    priority = 'medium',
    metadata = {},
  }) {
    try {
      console.log('📝 Creating notification in database...');
      console.log('📋 Recipient:', recipient);
      console.log('📋 Type:', type);
      console.log('📋 Title:', title);

      const notification = await Notification.create({
        recipient,
        sender,
        type,
        title,
        message,
        relatedTo,
        link,
        actionRequired,
        priority,
        metadata,
      });

      console.log('✅ Notification created in DB:', notification._id);

      // Populate sender details for real-time emission
      await notification.populate('sender', 'firstName lastName avatar');

      console.log('📡 Emitting socket event to room:', `notifications_${recipient.toString()}`);
      console.log('🔌 IO instance available:', !!this.io);

      // Emit socket event if io is available
      if (this.io) {
        this.io.to(`notifications_${recipient.toString()}`).emit('new_notification', notification);
        console.log('✅ Socket event emitted successfully');
        logger.info(`Real-time notification sent to user ${recipient.toString()}`);
      } else {
        console.warn('⚠️ IO instance not available - notification not sent via socket');
      }

      return notification;
    } catch (error) {
      console.error('❌ Notification creation failed:', error);
      logger.error(`Notification creation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notify proposal received
   */
  async notifyProposalReceived(clientId, freelancerId, jobId, proposalId) {
    try {
      // Fetch freelancer and job details for richer notification
      const freelancer = await User.findById(freelancerId).select('firstName lastName avatar');
      const job = await Job.findById(jobId).select('title');

      const freelancerName = freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'A freelancer';
      const jobTitle = job ? job.title : 'your job';

      return this.createNotification({
        recipient: clientId,
        sender: freelancerId,
        type: 'proposal_received',
        title: 'New Proposal Received',
        message: `${freelancerName} has submitted a proposal for "${jobTitle}"`,
        relatedTo: {
          model: 'Proposal',
          id: proposalId,
        },
        link: `/proposals/${proposalId}`,
        actionRequired: true,
        priority: 'high',
        metadata: {
          jobId: jobId.toString(),
          jobTitle,
          freelancerName,
        },
      });
    } catch (error) {
      logger.error(`Proposal notification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notify proposal accepted
   */
  async notifyProposalAccepted(freelancerId, clientId, proposalId) {
    return this.createNotification({
      recipient: freelancerId,
      sender: clientId,
      type: 'proposal_accepted',
      title: 'Proposal Accepted!',
      message: 'Your proposal has been accepted',
      relatedTo: {
        model: 'Proposal',
        id: proposalId,
      },
      link: `/proposals/${proposalId}`,
      priority: 'high',
    });
  }

  /**
   * Notify proposal rejected
   */
  async notifyProposalRejected(freelancerId, clientId, proposalId, rejectionReason) {
    return this.createNotification({
      recipient: freelancerId,
      sender: clientId,
      type: 'proposal_rejected',
      title: 'Proposal Rejected',
      message: rejectionReason
        ? `Your proposal was rejected: ${rejectionReason}`
        : 'Your proposal was rejected',
      relatedTo: {
        model: 'Proposal',
        id: proposalId,
      },
      link: `/proposals/${proposalId}`,
      priority: 'medium',
      metadata: { rejectionReason },
    });
  }

  /**
   * Notify contract created
   */
  async notifyContractCreated(recipientId, senderId, contractId) {
    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: 'contract_created',
      title: 'New Contract Created',
      message: 'A new contract has been created',
      relatedTo: {
        model: 'Contract',
        id: contractId,
      },
      link: `/contracts/${contractId}`,
      actionRequired: true,
      priority: 'high',
    });
  }

  /**
   * Notify milestone submitted
   */
  async notifyMilestoneSubmitted(clientId, freelancerId, milestoneId, contractId) {
    return this.createNotification({
      recipient: clientId,
      sender: freelancerId,
      type: 'milestone_submitted',
      title: 'Milestone Submitted',
      message: 'A milestone has been submitted for your review',
      relatedTo: {
        model: 'Milestone',
        id: milestoneId,
      },
      link: `/contracts/${contractId}`,
      actionRequired: true,
      priority: 'high',
    });
  }

  /**
   * Notify payment received
   */
  async notifyPaymentReceived(userId, amount, transactionId) {
    return this.createNotification({
      recipient: userId,
      type: 'payment_received',
      title: 'Payment Received',
      message: `You have received a payment of $${amount}`,
      relatedTo: {
        model: 'Payment',
        id: transactionId,
      },
      link: `/transactions/${transactionId}`,
      priority: 'high',
    });
  }

  /**
   * Notify message received
   */
  async notifyMessageReceived(recipientId, senderId, messageId, conversationId) {
    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: 'message',
      title: 'New Message',
      message: 'You have received a new message',
      relatedTo: {
        model: 'Message',
        id: messageId,
      },
      link: `/messages/${conversationId}`,
      priority: 'medium',
    });
  }

  /**
   * Notify message received
   */
  async notifyMessageReceived(recipientId, senderId, messageId, conversationId) {
    try {
      const sender = await User.findById(senderId).select('firstName lastName');
      const senderName = `${sender.firstName} ${sender.lastName}`;

      return this.createNotification({
        recipient: recipientId,
        sender: senderId,
        type: 'message',
        title: 'New Message',
        message: `${senderName} sent you a message`,
        relatedTo: {
          model: 'Message',
          id: messageId,
        },
        link: `/chat?user=${senderId}`,
        priority: 'medium',
        metadata: {
          conversationId,
          senderName,
        },
      });
    } catch (error) {
      logger.error(`Message notification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notify job invitation
   */
  async notifyJobInvitation(freelancerId, clientId, jobId) {
    return this.createNotification({
      recipient: freelancerId,
      sender: clientId,
      type: 'job_invitation',
      title: 'Job Invitation',
      message: 'You have been invited to submit a proposal',
      relatedTo: {
        model: 'Job',
        id: jobId,
      },
      link: `/jobs/${jobId}`,
      priority: 'high',
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const query = { recipient: userId };

    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('sender', 'firstName lastName avatar');

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    return Notification.markAsRead(notificationId, userId);
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId) {
    return Notification.markAllAsRead(userId);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return Notification.getUnreadCount(userId);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });
  }
}

export default new NotificationService();

