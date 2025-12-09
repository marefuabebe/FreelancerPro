import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewerRole: {
      type: String,
      enum: ['client', 'freelancer'],
      required: true,
    },
    rating: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      quality: {
        type: Number,
        min: 1,
        max: 5,
      },
      expertise: {
        type: Number,
        min: 1,
        max: 5,
      },
      professionalism: {
        type: Number,
        min: 1,
        max: 5,
      },
      deadlines: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      required: true,
      minlength: [20, 'Review comment must be at least 20 characters'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    pros: [String],
    cons: [String],
    recommend: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    response: {
      text: String,
      respondedAt: Date,
    },
    helpful: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    helpfulCount: {
      type: Number,
      default: 0,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    flaggedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: String,
        flaggedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ 'rating.overall': -1 });

// Calculate average rating
reviewSchema.methods.calculateAverageRating = function () {
  const ratings = [
    this.rating.communication,
    this.rating.quality,
    this.rating.expertise,
    this.rating.professionalism,
    this.rating.deadlines,
  ].filter((r) => r !== undefined);

  if (ratings.length > 0) {
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    this.rating.overall = Math.round((sum / ratings.length) * 10) / 10;
  }
};

// Pre-save hook to calculate average
reviewSchema.pre('save', function (next) {
  if (!this.rating.overall) {
    this.calculateAverageRating();
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;

