import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [100, 'Cover letter must be at least 100 characters'],
    },
    proposedRate: {
      type: {
        type: String,
        enum: ['fixed', 'hourly'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: [0, 'Rate cannot be negative'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 day'],
    },
    durationUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days',
    },
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        amount: {
          type: Number,
          required: true,
        },
        dueDate: Date,
        order: Number,
      },
    ],
    attachments: [
      {
        url: { type: String, required: false },
        publicId: { type: String, required: false },
        name: { type: String, required: false },
        size: { type: Number, required: false },
        type: { type: String, required: false },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'interviewing'],
      default: 'pending',
    },
    clientViewed: {
      type: Boolean,
      default: false,
    },
    viewedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    withdrawnAt: Date,
    rejectionReason: String,
    questions: [
      {
        question: String,
        askedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        answer: String,
        answeredAt: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    boosted: {
      type: Boolean,
      default: false,
    },
    connects: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });
proposalSchema.index({ freelancer: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ createdAt: -1 });

// Ensure freelancer can only submit one proposal per job
proposalSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingProposal = await this.constructor.findOne({
      job: this.job,
      freelancer: this.freelancer,
    });

    if (existingProposal) {
      const error = new Error('You have already submitted a proposal for this job');
      return next(error);
    }
  }
  next();
});

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;

