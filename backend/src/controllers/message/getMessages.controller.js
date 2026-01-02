import Message from '../../models/message.model.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * @desc    Get messages for a specific conversation
 * @route   GET /api/messages/:conversationId
 * @access  Private
 */
export const getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  console.log('📨 GET /messages/:conversationId');
  console.log('📋 Param conversationId:', conversationId);
  console.log('👤 User ID:', userId);

  // If conversationId is a userId (which happens when starting a new chat from UI),
  // we need to resolve the actual conversationId
  let actualConversationId = conversationId;

  // Check if conversationId looks like a MongoDB ObjectId (24 hex chars)
  // If it's a userId, we construct the conversationId
  if (conversationId.match(/^[0-9a-fA-F]{24}$/) && !conversationId.includes('_')) {
    const ids = [userId.toString(), conversationId].sort();
    actualConversationId = ids.join('_');
    console.log('🔄 Generated conversationId:', actualConversationId);
  } else {
    console.log('📋 Using provided conversationId:', actualConversationId);
  }

  const messages = await Message.find({
    conversationId: actualConversationId,
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'firstName lastName avatar')
    .populate('recipient', 'firstName lastName avatar');

  console.log('✅ Found', messages.length, 'messages');

  res.status(200).json({
    success: true,
    data: messages,
  });
});
