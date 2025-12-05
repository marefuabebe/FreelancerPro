import User from '../../models/user.model.js';
import { sendSuccess, sendUnauthorized } from '../../utils/responseHandler.js';
import { generateTokens, setTokenCookie } from '../../utils/generateToken.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  // Find user and include password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return sendUnauthorized(res, 'Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    return sendUnauthorized(res, 'Your account has been deactivated');
  }

  if (!user.emailVerified) {
    return sendUnauthorized(res, 'Please verify your email before signing in', {
      verificationRequired: true,
      email: user.email,
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  // Set cookie
  setTokenCookie(res, accessToken);

  // Remove password from response
  user.password = undefined;
  user.refreshToken = undefined;

  sendSuccess(res, 200, 'Login successful', {
    user,
    token: accessToken,
    refreshToken,
  });
});

export default login;

