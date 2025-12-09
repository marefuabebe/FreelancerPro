import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['email', 'phone', 'kyc', 'identity', 'address'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'approved', 'rejected', 'expired'],
      default: 'pending',
    },
    // Email verification
    emailToken: String,
    emailTokenExpiry: Date,

    // Phone verification
    phoneOTP: String,
    phoneOTPExpiry: Date,
    phoneVerificationAttempts: {
      type: Number,
      default: 0,
    },

    // KYC/Identity verification
    documents: [
      {
        type: {
          type: String,
          enum: ['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement'],
        },
        frontImage: {
          url: String,
          publicId: String,
        },
        backImage: {
          url: String,
          publicId: String,
        },
        uploadedAt: Date,
        verified: Boolean,
      },
    ],
    personalInfo: {
      fullName: String,
      dateOfBirth: Date,
      nationality: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
      },
      taxId: String,
    },
    verificationProvider: {
      name: String,
      referenceId: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    reviewNotes: String,
    rejectionReason: String,
    approvedAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
verificationSchema.index({ user: 1, type: 1 });
verificationSchema.index({ status: 1 });
verificationSchema.index({ emailToken: 1 });
verificationSchema.index({ expiresAt: 1 });

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;

