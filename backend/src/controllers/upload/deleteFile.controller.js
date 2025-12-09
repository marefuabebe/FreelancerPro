import fileService from '../../services/file.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Delete a file from Cloudinary
 * @route DELETE /api/v1/upload/:publicId
 * @access Private
 */
export const deleteFile = catchAsync(async (req, res) => {
  const { publicId } = req.params;

  await fileService.deleteFile(publicId);

  sendSuccess(res, 200, 'File deleted successfully');
});

export default deleteFile;

