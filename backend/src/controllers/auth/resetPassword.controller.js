import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import { sendSuccess, sendUnauthorized } from '../../utils/responseHandler.js';
import { config } from '../../config/env.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Reset password
 * @route POST /api/v1/auth/reset-password
 * @access Public
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded.type !== 'password_reset') {
      return sendUnauthorized(res, 'Invalid reset token');
    }

    // Update password
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return sendUnauthorized(res, 'User not found');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password reset successful');
  } catch (error) {
    return sendUnauthorized(res, 'Invalid or expired reset token');
  }
});

export default resetPassword;

