import Job from '../../models/job.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Get job by ID or slug
 * @route GET /api/v1/jobs/:id
 * @access Public
 */
export const getJobById = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Try to find by ID first, then by slug
  let job = await Job.findById(id)
    .populate('client', 'firstName lastName avatar rating location')
    .populate('proposalList');

  if (!job) {
    job = await Job.findOne({ slug: id })
      .populate('client', 'firstName lastName avatar rating location')
      .populate('proposalList');
  }

  if (!job) {
    return sendNotFound(res, 'Job not found');
  }

  // Increment views
  job.views += 1;
  await job.save({ validateBeforeSave: false });

  sendSuccess(res, 200, 'Job fetched successfully', job);
});

export default getJobById;

