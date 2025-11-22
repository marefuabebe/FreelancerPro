import User from '../../models/user.model.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import { clearTokenCookie } from '../../utils/generateToken.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = catchAsync(async (req, res) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: null,
    isOnline: false,
    lastSeen: new Date(),
  });

  // Clear cookie
  clearTokenCookie(res);

  sendSuccess(res, 200, 'Logout successful');
});

export default logout;

