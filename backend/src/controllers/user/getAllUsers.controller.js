import User from '../../models/user.model.js';
import { sendSuccess, sendUnauthorized } from '../../utils/responseHandler.js';

export const getAllUsers = async (req, res) => {
    try {
        console.log('🔍 getAllUsers called, user:', req.user?._id);
        if (!req.user) {
            console.error('❌ No user in request');
            return sendUnauthorized(res, 'User not authenticated');
        }
        const currentUserId = req.user._id;

        // Get all users except the current user
        const users = await User.find({ _id: { $ne: currentUserId }, isActive: true })
            .select('firstName lastName email avatar role')
            .limit(50)
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${users.length} users`);
        sendSuccess(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        console.error('❌ getAllUsers error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default getAllUsers;
