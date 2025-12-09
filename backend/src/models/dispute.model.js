import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    respondent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    initiatorRole: {
      type: String,
      enum: ['client', 'freelancer'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'payment_issue',
        'quality_issue',
        'deadline_missed',
        'scope_disagreement',
        'communication_issue',
        'contract_violation',
        'other',
      ],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: true,
      minlength: [50, 'Description must be at least 50 characters'],
    },
    evidence: [
      {
        type: {
          type: String,
          enum: ['document', 'image', 'video', 'screenshot', 'message_log'],
        },
        url: String,
        publicId: String,
        name: String,
        description: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ['open', 'under_review', 'awaiting_response', 'mediation', 'resolved', 'closed', 'cancelled'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    amountInDispute: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    initiatorProposal: {
      resolution: String,
      amount: Number,
      proposedAt: Date,
    },
    respondentResponse: {
      response: String,
      amount: Number,
      respondedAt: Date,
    },
    adminAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAt: Date,
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        senderRole: {
          type: String,
          enum: ['initiator', 'respondent', 'admin'],
        },
        message: String,
        attachments: [
          {
            url: String,
            publicId: String,
            name: String,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolution: {
      type: String,
      enum: ['in_favor_of_client', 'in_favor_of_freelancer', 'split_decision', 'mutual_agreement', 'withdrawn'],
    },
    resolutionDetails: String,
    refundAmount: Number,
    refundTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    closedAt: Date,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
disputeSchema.index({ contract: 1 });
disputeSchema.index({ initiator: 1 });
disputeSchema.index({ respondent: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ adminAssigned: 1 });
disputeSchema.index({ createdAt: -1 });

const Dispute = mongoose.model('Dispute', disputeSchema);

export default Dispute;

