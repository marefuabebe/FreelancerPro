import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    conversationId: {
      type: String,
      required: false, // Auto-generated in pre-save hook if not provided
      index: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Job', 'Contract', 'Proposal'],
      },
      id: mongoose.Schema.Types.ObjectId,
    },
    attachments: [
      {
        url: { type: String },
        publicId: { type: String },
        name: { type: String },
        size: { type: Number },
        type: { type: String },
      },
    ],
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    originalContent: String,
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        emoji: String,
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
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ read: 1 });
messageSchema.index({ createdAt: -1 });

// Generate conversation ID before saving
messageSchema.pre('save', function (next) {
  if (!this.conversationId && this.sender && this.recipient) {
    const ids = [this.sender.toString(), this.recipient.toString()].sort();
    this.conversationId = ids.join('_');
  }
  next();
});

// Static method to get conversation
messageSchema.statics.getConversation = async function (userId1, userId2) {
  const ids = [userId1.toString(), userId2.toString()].sort();
  const conversationId = ids.join('_');

  return this.find({ conversationId }).sort({ createdAt: 1 });
};

// Static method to mark messages as read
messageSchema.statics.markAsRead = async function (conversationId, userId) {
  return this.updateMany(
    {
      conversationId,
      recipient: userId,
      read: false,
    },
    {
      read: true,
      readAt: new Date(),
    }
  );
};

const Message = mongoose.model('Message', messageSchema);

export default Message;

