import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    contractType: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    hourlyRate: Number,
    estimatedHours: Number,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    actualEndDate: Date,
    terms: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed', 'cancelled', 'disputed'],
      default: 'draft',
    },
    milestones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone',
      },
    ],
    totalPaid: {
      type: Number,
      default: 0,
    },
    totalHoursWorked: {
      type: Number,
      default: 0,
    },
    escrowAmount: {
      type: Number,
      default: 0,
    },
    escrowReleased: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    clientSignature: {
      signed: {
        type: Boolean,
        default: false,
      },
      signedAt: Date,
      ipAddress: String,
    },
    freelancerSignature: {
      signed: {
        type: Boolean,
        default: false,
      },
      signedAt: Date,
      ipAddress: String,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    feedbackFromClient: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: Date,
    },
    feedbackFromFreelancer: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: Date,
    },
    dispute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dispute',
    },
    pausedAt: Date,
    pauseReason: String,
    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amendments: [
      {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        reason: String,
        amendedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        amendedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
contractSchema.index({ client: 1 });
contractSchema.index({ freelancer: 1 });
contractSchema.index({ job: 1 });
contractSchema.index({ proposal: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ createdAt: -1 });

// Virtual for remaining amount
contractSchema.virtual('remainingAmount').get(function () {
  return this.amount - this.totalPaid;
});

// Virtual for is fully signed
contractSchema.virtual('isFullySigned').get(function () {
  return this.clientSignature.signed && this.freelancerSignature.signed;
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;

