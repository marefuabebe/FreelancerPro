import Message from '../../models/message.model.js';
import { sendCreated } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueNotification } from '../../jobs/notificationQueue.js';

/**
 * Send a message
 * @route POST /api/v1/messages
 * @access Private
 */
export const createMessage = catchAsync(async (req, res) => {
  const { recipientId, content, attachments, relatedTo } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    content,
    attachments,
    relatedTo,
  });

  await message.populate('sender', 'firstName lastName avatar');

  // Socket.io will handle real-time delivery
  // Also queue notification
  await queueNotification('message', {
    recipientId,
    senderId: req.user._id,
    messageId: message._id,
    conversationId: message.conversationId,
  });

  sendCreated(res, 'Message sent successfully', message);
});

export default createMessage;

