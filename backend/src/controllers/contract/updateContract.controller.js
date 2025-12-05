import Contract from '../../models/contract.model.js';
import { sendSuccess, sendNotFound, sendForbidden } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Update contract status
 * @route PUT /api/v1/contracts/:id
 * @access Private
 */
export const updateContract = catchAsync(async (req, res) => {
  const { status, progress } = req.body;

  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    return sendNotFound(res, 'Contract not found');
  }

  // Only parties involved can update
  const isParty =
    contract.client.toString() === req.user._id.toString() ||
    contract.freelancer.toString() === req.user._id.toString();

  if (!isParty) {
    return sendForbidden(res, 'You are not authorized to update this contract');
  }

  if (status) contract.status = status;
  if (progress !== undefined) contract.progress = progress;

  await contract.save();

  sendSuccess(res, 200, 'Contract updated successfully', contract);
});

export default updateContract;

