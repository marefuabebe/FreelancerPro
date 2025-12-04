import notificationService from '../../services/notification.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Delete notification
 * @route DELETE /api/v1/notifications/:id
 * @access Private
 */
export const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  sendSuccess(res, 200, 'Notification deleted successfully');
});

export default deleteNotification;

