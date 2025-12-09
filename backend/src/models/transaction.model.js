import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['payment', 'refund', 'payout', 'escrow_deposit', 'escrow_release', 'fee', 'bonus'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Contract', 'Milestone', 'Job'],
      },
      id: mongoose.Schema.Types.ObjectId,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'paypal', 'stripe', 'wallet'],
    },
    paymentMethodId: String,
    stripePaymentIntentId: String,
    stripeChargeId: String,
    stripeTransferId: String,
    platformFee: {
      type: Number,
      default: 0,
    },
    processingFee: {
      type: Number,
      default: 0,
    },
    netAmount: Number,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    failureReason: String,
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refundedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ stripePaymentIntentId: 1 });
transactionSchema.index({ from: 1, to: 1 });

// Calculate net amount before saving
transactionSchema.pre('save', function (next) {
  if (this.isModified('amount') || this.isModified('platformFee') || this.isModified('processingFee')) {
    this.netAmount = this.amount - (this.platformFee || 0) - (this.processingFee || 0);
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

