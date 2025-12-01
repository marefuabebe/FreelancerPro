import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Verification from '../../models/verification.model.js';
import { sendSuccess, sendUnauthorized } from '../../utils/responseHandler.js';
import { config } from '../../config/env.js';
import catchAsync from '../../utils/catchAsync.js';


/**
 * Verify email address
 * @route POST /api/v1/auth/verify-email
 * @access Public
 */
export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded.type !== 'email_verification') {
      return sendUnauthorized(res, 'Invalid verification token');
    }

    // Update user
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendUnauthorized(res, 'User not found');
    }

    if (user.emailVerified) {
      return sendSuccess(res, 200, 'Email already verified');
    }

    user.emailVerified = true;
    await user.save();

    // Update verification record
    await Verification.findOneAndUpdate(
      { user: user._id, type: 'email' },
      {
        status: 'approved',
        approvedAt: new Date(),
      }
    );

    sendSuccess(res, 200, 'Email verified successfully. Please log in.');
  } catch (error) {
    return sendUnauthorized(res, 'Invalid or expired verification token');
  }
});

export default verifyEmail;

