import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'message',
        'proposal_received',
        'proposal_accepted',
        'proposal_rejected',
        'contract_created',
        'contract_signed',
        'milestone_submitted',
        'milestone_approved',
        'milestone_rejected',
        'payment_received',
        'payment_sent',
        'review_received',
        'job_invitation',
        'job_closed',
        'dispute_created',
        'dispute_resolved',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Job', 'Contract', 'Proposal', 'Message', 'Milestone', 'Payment', 'Review', 'Dispute'],
      },
      id: mongoose.Schema.Types.ObjectId,
    },
    link: String,
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    actionRequired: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  return this.create(data);
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function (notificationId, userId) {
  return this.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true, readAt: new Date() },
    { new: true }
  );
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany({ recipient: userId, read: false }, { read: true, readAt: new Date() });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ recipient: userId, read: false });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

