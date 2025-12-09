import Message from '../../models/message.model.js';
import { sendPaginatedResponse } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { getPagination } from '../../utils/helpers.js';

/**
 * Get conversation with a user
 * @route GET /api/v1/messages/conversation/:userId
 * @access Private
 */
export const getConversation = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const filter = {
    $or: [
      { sender: req.user._id, recipient: userId },
      { sender: userId, recipient: req.user._id },
    ],
  };

  const pagination = getPagination(
    await Message.countDocuments(filter),
    parseInt(page),
    parseInt(limit)
  );

  const messages = await Message.find(filter)
    .sort({ createdAt: 1 })
    .limit(pagination.limit)
    .skip(pagination.skip)
    .populate('sender', 'firstName lastName avatar')
    .populate('recipient', 'firstName lastName avatar');

  // Mark messages as read
  await Message.markAsRead(messages[0]?.conversationId, req.user._id);

  sendPaginatedResponse(res, 200, 'Conversation fetched successfully', messages, pagination);
});

export default getConversation;

