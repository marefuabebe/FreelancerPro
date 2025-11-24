import searchService from '../../services/search.service.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Search jobs with advanced filters
 * @route GET /api/v1/jobs/search
 * @access Public
 */
export const searchJobs = catchAsync(async (req, res) => {
  const result = await searchService.searchJobs(req.query);
  sendSuccess(res, 200, 'Jobs searched successfully', result);
});

export default searchJobs;

