import Proposal from '../../models/proposal.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Get proposal by ID
 * @route GET /api/v1/proposals/:id
 * @access Private
 */
export const getProposalById = catchAsync(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id)
    .populate('freelancer', 'firstName lastName avatar rating hourlyRate skills completedJobs')
    .populate('job', 'title description budget status client');

  if (!proposal) {
    return sendNotFound(res, 'Proposal not found');
  }

  // Mark as viewed by client
  if (!proposal.clientViewed) {
    proposal.clientViewed = true;
    proposal.viewedAt = new Date();
    await proposal.save({ validateBeforeSave: false });
  }

  sendSuccess(res, 200, 'Proposal fetched successfully', proposal);
});

export default getProposalById;

