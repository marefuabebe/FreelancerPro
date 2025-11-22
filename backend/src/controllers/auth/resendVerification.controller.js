import User from '../../models/user.model.js';
import Verification from '../../models/verification.model.js';
import { sendSuccess, sendNotFound, sendBadRequest } from '../../utils/responseHandler.js';
import { generateEmailVerificationToken } from '../../utils/generateToken.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueEmail } from '../../jobs/emailQueue.js';
import emailService from '../../services/email.service.js';
import logger from '../../utils/logger.js';

/**
 * Resend verification email
 * @route POST /api/v1/auth/resend-verification
 * @access Public
 */
export const resendVerification = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendBadRequest(res, 'Email is required');
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  // Check if email is already verified
  if (user.emailVerified) {
    return sendBadRequest(res, 'Email is already verified');
  }

  // Generate new verification token
  const verificationToken = generateEmailVerificationToken(user._id);

  // Update or create verification record
  await Verification.findOneAndUpdate(
    { user: user._id, type: 'email' },
    {
      emailToken: verificationToken,
      emailTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: 'pending',
    },
    { upsert: true, new: true }
  );

  // Send verification email directly (since Redis/queue is disabled)
  try {
    await emailService.sendEmailVerification(user, verificationToken);
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
    return sendBadRequest(res, 'Failed to send verification email');
  }

  const response = {
    message: 'Verification email sent successfully'
  };

  // In development, include a direct verificationUrl to unblock flows without SMTP
  if (process.env.NODE_ENV !== "production") {
    response.verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"
      }/verify-email?token=${verificationToken}`;
    console.log("\n🔗 EMAIL VERIFICATION URL (RESEND):");
    console.log(response.verificationUrl);
  }

  sendSuccess(res, 200, 'Verification email sent successfully', response);
});

export default resendVerification;
