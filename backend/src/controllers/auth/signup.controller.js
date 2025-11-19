import User from "../../models/user.model.js";
import Verification from "../../models/verification.model.js";
import { sendCreated } from "../../utils/responseHandler.js";
import {
  generateTokens,
  generateEmailVerificationToken,
  setTokenCookie,
} from "../../utils/generateToken.js";
import catchAsync from "../../utils/catchAsync.js";
import { queueEmail } from "../../jobs/emailQueue.js";
import emailService from "../../services/email.service.js";
import logger from "../../utils/logger.js";

/**
 * Sign up a new user
 * @route POST /api/v1/auth/signup
 * @access Public
 */
export const signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, role, phone } = req.body;

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
  });

  // Generate verification token
  const verificationToken = generateEmailVerificationToken(user._id);

  // Create verification record
  await Verification.create({
    user: user._id,
    type: "email",
    emailToken: verificationToken,
    emailTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Generate auth tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookie
  setTokenCookie(res, accessToken);

  // Send emails directly (since Redis/queue is disabled)
  try {
    await emailService.sendWelcome(user);
    await emailService.sendEmailVerification(user, verificationToken);
  } catch (error) {
    logger.error(`Failed to send emails: ${error.message}`);
    // Don't fail registration if email sending fails
  }

  const response = {
    user,
    token: accessToken,
    refreshToken,
  };

  // In development, include a direct verificationUrl to unblock flows without SMTP
  if (process.env.NODE_ENV !== "production") {
    response.verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/verify-email?token=${verificationToken}`;
    console.log("\n🔗 EMAIL VERIFICATION URL:");
    console.log(response.verificationUrl);
    console.log(
      "📧 Copy this URL and open it in your browser to verify the email\n"
    );
  }

  sendCreated(res, "User registered successfully", response);
});

export default signup;
