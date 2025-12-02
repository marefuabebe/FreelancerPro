import Proposal from '../../models/proposal.model.js';
import { sendPaginatedResponse } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { getPagination } from '../../utils/helpers.js';

/**
 * Get proposals (for job or freelancer)
 * @route GET /api/v1/proposals
 * @access Private
 */
export const getProposals = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, jobId, status } = req.query;

  const filter = {};

  // If jobId provided, get proposals for that job (client view)
  if (jobId) {
    filter.job = jobId;
  } else if (req.user.role === 'freelancer') {
    // Freelancer sees their own proposals
    filter.freelancer = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  const pagination = getPagination(
    await Proposal.countDocuments(filter),
    parseInt(page),
    parseInt(limit)
  );

  const proposals = await Proposal.find(filter)
    .sort({ createdAt: -1 })
    .limit(pagination.limit)
    .skip(pagination.skip)
    .populate('freelancer', 'firstName lastName avatar rating hourlyRate')
    .populate('job', 'title budget status');

  sendPaginatedResponse(res, 200, 'Proposals fetched successfully', proposals, pagination);
});

export default getProposals;

