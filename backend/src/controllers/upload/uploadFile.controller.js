import fileService from '../../services/file.service.js';
import { sendSuccess, sendBadRequest } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Upload a file
 * @route POST /api/v1/upload/file
 * @access Private
 */
export const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    return sendBadRequest(res, 'Please upload a file');
  }

  const { folder = 'general' } = req.body;

  const result = await fileService.uploadFile(req.file.path, folder);

  sendSuccess(res, 200, 'File uploaded successfully', result);
});

export default uploadFile;

