import Contract from '../../models/contract.model.js';
import { sendPaginatedResponse } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { getPagination } from '../../utils/helpers.js';

/**
 * Get user's contracts
 * @route GET /api/v1/contracts
 * @access Private
 */
export const getContracts = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const filter = {
    $or: [{ client: req.user._id }, { freelancer: req.user._id }],
  };

  if (status) {
    filter.status = status;
  }

  const pagination = getPagination(
    await Contract.countDocuments(filter),
    parseInt(page),
    parseInt(limit)
  );

  const contracts = await Contract.find(filter)
    .sort({ createdAt: -1 })
    .limit(pagination.limit)
    .skip(pagination.skip)
    .populate('client', 'firstName lastName avatar')
    .populate('freelancer', 'firstName lastName avatar rating')
    .populate('job', 'title category');

  sendPaginatedResponse(res, 200, 'Contracts fetched successfully', contracts, pagination);
});

export default getContracts;

