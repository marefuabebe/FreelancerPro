import User from '../../models/user.model.js';
import Verification from '../../models/verification.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Verify or reject KYC
 * @route POST /api/v1/admin/kyc/:id/verify
 * @access Private - Admin only
 */
export const verifyKYC = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body; // status: 'approved' or 'rejected'

  const verification = await Verification.findOne({ user: id, type: 'kyc' });

  if (!verification) {
    return sendNotFound(res, 'KYC verification not found');
  }

  verification.status = status;
  verification.reviewedBy = req.user._id;
  verification.reviewedAt = new Date();
  verification.reviewNotes = notes;

  if (status === 'approved') {
    verification.approvedAt = new Date();
  } else if (status === 'rejected') {
    verification.rejectionReason = notes;
  }

  await verification.save();

  // Update user KYC status
  await User.findByIdAndUpdate(id, {
    kycStatus: status,
    kycVerified: status === 'approved',
  });

  sendSuccess(res, 200, `KYC ${status} successfully`, verification);
});

export default verifyKYC;

