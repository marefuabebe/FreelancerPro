import mongoose from 'mongoose';
import slugify from 'slugify';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    budget: {
      type: {
        type: String,
        enum: ['fixed', 'hourly'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: [0, 'Budget amount cannot be negative'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
      maxRate: Number,
    },
    duration: {
      type: String,
      enum: ['short', 'medium', 'long'],
      required: true,
    },
    estimatedTime: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months'],
      },
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'intermediate', 'expert'],
      required: true,
    },
    attachments: [
      {
        url: String,
        publicId: String,
        name: String,
        size: Number,
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled', 'closed'],
      default: 'open',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'invited_only'],
      default: 'public',
    },
    invitedFreelancers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    proposals: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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
    milestones: [
      {
        title: String,
        description: String,
        amount: Number,
        dueDate: Date,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        default: 'remote',
      },
      country: String,
      city: String,
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    startDate: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes (slug index is already created by unique: true)
jobSchema.index({ client: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ 'budget.amount': 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text' });

// Generate slug before saving
jobSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });

    // Ensure unique slug
    const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
    const jobsWithSlug = await this.constructor.find({ slug: slugRegEx });

    if (jobsWithSlug.length > 0) {
      this.slug = `${this.slug}-${jobsWithSlug.length + 1}`;
    }
  }
  next();
});

// Virtual for proposals
jobSchema.virtual('proposalList', {
  ref: 'Proposal',
  localField: '_id',
  foreignField: 'job',
});

const Job = mongoose.model('Job', jobSchema);

export default Job;

