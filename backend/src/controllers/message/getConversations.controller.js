import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * @desc    Get all conversations for current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversations = catchAsync(async (req, res) => {
    const userId = req.user._id;

    // Aggregate to find unique conversations
    const conversations = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { recipient: userId }],
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $group: {
                _id: '$conversationId',
                lastMessage: { $first: '$$ROOT' },
            },
        },
        {
            $sort: { 'lastMessage.createdAt': -1 },
        },
    ]);

    // Populate user details for each conversation
    const populatedConversations = await Promise.all(
        conversations.map(async (convo) => {
            const message = convo.lastMessage;
            const otherUserId =
                message.sender.toString() === userId.toString()
                    ? message.recipient
                    : message.sender;

            const otherUser = await User.findById(otherUserId).select(
                'firstName lastName email avatar role'
            );

            return {
                conversationId: convo._id,
                lastMessage: {
                    content: message.content,
                    createdAt: message.createdAt,
                    read: message.read,
                    sender: message.sender,
                },
                participant: otherUser,
                participantId: otherUser?._id,
                participantName: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User',
                participantAvatar: otherUser?.avatar,
            };
        })
    );

    res.status(200).json({
        success: true,
        data: populatedConversations,
    });
});
