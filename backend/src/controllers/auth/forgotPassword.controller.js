import User from '../../models/user.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import { generatePasswordResetToken } from '../../utils/generateToken.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueEmail } from '../../jobs/emailQueue.js';

/**
 * Send password reset email
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return sendNotFound(res, 'No user found with that email address');
  }

  // Generate reset token
  const resetToken = generatePasswordResetToken(user._id);

  // Queue reset email
  await queueEmail('password_reset', { user, token: resetToken });

  sendSuccess(res, 200, 'Password reset email sent');
});

export default forgotPassword;

