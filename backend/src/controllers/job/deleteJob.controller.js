import Job from '../../models/job.model.js';
import Proposal from '../../models/proposal.model.js';
import { sendSuccess, sendNotFound, sendForbidden } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Delete job (soft delete - mark as cancelled)
 * @route DELETE /api/v1/jobs/:id
 * @access Private - Client only (owner)
 */
export const deleteJob = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return sendNotFound(res, 'Job not found');
  }

  // Check ownership
  if (job.client.toString() !== req.user._id.toString()) {
    return sendForbidden(res, 'You can only delete your own jobs');
  }

  // Can't delete if job has active proposals or contracts
  const activeProposals = await Proposal.countDocuments({
    job: job._id,
    status: { $in: ['pending', 'accepted'] },
  });

  if (activeProposals > 0) {
    return sendForbidden(res, 'Cannot delete job with active proposals');
  }

  job.status = 'cancelled';
  job.cancelledAt = new Date();
  job.cancelReason = req.body.reason || 'Deleted by client';
  await job.save();

  sendSuccess(res, 200, 'Job deleted successfully');
});

export default deleteJob;

