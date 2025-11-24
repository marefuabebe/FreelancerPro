import Job from '../../models/job.model.js';
import { sendSuccess, sendNotFound, sendForbidden } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Update job
 * @route PUT /api/v1/jobs/:id
 * @access Private - Client only (owner)
 */
export const updateJob = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return sendNotFound(res, 'Job not found');
  }

  // Check ownership
  if (job.client.toString() !== req.user._id.toString()) {
    return sendForbidden(res, 'You can only update your own jobs');
  }

  // Can't update if job is in progress or completed
  if (['in_progress', 'completed', 'cancelled'].includes(job.status)) {
    return sendForbidden(res, `Cannot update job with status: ${job.status}`);
  }

  Object.assign(job, req.body);
  await job.save();

  sendSuccess(res, 200, 'Job updated successfully', job);
});

export default updateJob;

