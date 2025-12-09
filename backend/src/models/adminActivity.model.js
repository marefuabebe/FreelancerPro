import mongoose from 'mongoose';

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'user_suspended',
        'user_activated',
        'user_deleted',
        'job_deleted',
        'job_featured',
        'kyc_approved',
        'kyc_rejected',
        'dispute_assigned',
        'dispute_resolved',
        'payment_refunded',
        'content_moderated',
        'settings_changed',
        'settings_changed',
        'report_generated',
        'admin_login',
      ],
      required: true,
    },
    targetModel: {
      type: String,
      enum: ['User', 'Job', 'Contract', 'Dispute', 'Transaction', 'Review', 'Admin'],
    },
    targetId: mongoose.Schema.Types.ObjectId,
    details: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
adminActivitySchema.index({ admin: 1, createdAt: -1 });
adminActivitySchema.index({ action: 1 });
adminActivitySchema.index({ targetModel: 1, targetId: 1 });

const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);

export default AdminActivity;

