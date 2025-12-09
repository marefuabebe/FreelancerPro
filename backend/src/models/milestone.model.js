import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Milestone description is required'],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid', 'cancelled'],
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deliverables: [
      {
        title: String,
        description: String,
        url: String,
        publicId: String,
        type: String,
        uploadedAt: Date,
      },
    ],
    submittedAt: Date,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: Date,
    rejectionReason: String,
    paidAt: Date,
    paymentId: String,
    escrowReleased: {
      type: Boolean,
      default: false,
    },
    escrowReleasedAt: Date,
    revisionRequests: [
      {
        reason: String,
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        resolved: {
          type: Boolean,
          default: false,
        },
        resolvedAt: Date,
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
milestoneSchema.index({ contract: 1, order: 1 });
milestoneSchema.index({ status: 1 });
milestoneSchema.index({ dueDate: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;

