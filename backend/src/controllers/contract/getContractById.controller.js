import Contract from '../../models/contract.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Get contract by ID
 * @route GET /api/v1/contracts/:id
 * @access Private
 */
export const getContractById = catchAsync(async (req, res) => {
  const contract = await Contract.findById(req.params.id)
    .populate('client', 'firstName lastName avatar email')
    .populate('freelancer', 'firstName lastName avatar rating email')
    .populate('job', 'title description category')
    .populate('milestones');

  if (!contract) {
    return sendNotFound(res, 'Contract not found');
  }

  sendSuccess(res, 200, 'Contract fetched successfully', contract);
});

export default getContractById;

