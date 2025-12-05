import notificationService from '../../services/notification.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Get user notifications
 * @route GET /api/v1/notifications
 * @access Private
 */
export const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const result = await notificationService.getUserNotifications(req.user._id, {
    page: parseInt(page),
    limit: parseInt(limit),
    unreadOnly: unreadOnly === 'true',
  });

  sendSuccess(res, 200, 'Notifications fetched successfully', result);
});

export default getNotifications;

