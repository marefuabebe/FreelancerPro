import User from '../../models/user.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Delete user account (soft delete)
 * @route DELETE /api/v1/users/:id
 * @access Private
 */
export const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  sendSuccess(res, 200, 'Account deactivated successfully');
});

export default deleteUser;

