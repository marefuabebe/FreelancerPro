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
        const currentUserRole = req.user.role;

        // Determine which role to show based on current user's role
        let roleFilter = {};
        if (currentUserRole === 'client') {
            // Clients should only see freelancers
            roleFilter = { role: 'freelancer' };
        } else if (currentUserRole === 'freelancer') {
            // Freelancers should only see clients
            roleFilter = { role: 'client' };
        }

        // Get all users except the current user, filtered by role
        const users = await User.find({
            _id: { $ne: currentUserId },
            isActive: true,
            ...roleFilter
        })
            .select('firstName lastName email avatar role')
            .limit(50)
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${users.length} users (role filter: ${JSON.stringify(roleFilter)})`);
        sendSuccess(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        console.error('❌ getAllUsers error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default getAllUsers;
