import User from '../../models/user.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Get user by ID
 * @route GET /api/v1/users/:id
 * @access Public
 */
export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken')
    .populate('portfolio.images');

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  sendSuccess(res, 200, 'User fetched successfully', user);
});

/**
 * Get current user profile
 * @route GET /api/v1/users/me
 * @access Private
 */
export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshToken')
    .populate('portfolio.images');

  sendSuccess(res, 200, 'Profile fetched successfully', user);
});

export default { getUser, getMe };

