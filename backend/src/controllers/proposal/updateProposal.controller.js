import Proposal from '../../models/proposal.model.js';
import Job from '../../models/job.model.js';
import { sendSuccess, sendNotFound, sendForbidden } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueEmail } from '../../jobs/emailQueue.js';
import { queueNotification } from '../../jobs/notificationQueue.js';

/**
 * Update proposal status (accept/reject)
 * @route PUT /api/v1/proposals/:id
 * @access Private
 */
export const updateProposal = catchAsync(async (req, res) => {
  const { status, rejectionReason } = req.body;

  const proposal = await Proposal.findById(req.params.id)
    .populate('freelancer')
    .populate('job');

  if (!proposal) {
    return sendNotFound(res, 'Proposal not found');
  }

  // Client can accept/reject, Freelancer can withdraw
  if (status === 'accepted' || status === 'rejected') {
    // Only job owner can accept/reject
    if (proposal.job.client.toString() !== req.user._id.toString()) {
      return sendForbidden(res, 'Only the job owner can accept or reject proposals');
    }

    proposal.status = status;

    if (status === 'accepted') {
      proposal.acceptedAt = new Date();

      // Update job status
      const job = await Job.findById(proposal.job._id);
      job.status = 'in_progress';
      await job.save();

      // Notify freelancer
      await queueEmail('proposal_accepted', {
        freelancer: proposal.freelancer,
        job: proposal.job,
      });

      await queueNotification('proposal_accepted', {
        freelancerId: proposal.freelancer._id,
        clientId: req.user._id,
        proposalId: proposal._id,
      });
    } else if (status === 'rejected') {
      proposal.rejectedAt = new Date();
      proposal.rejectionReason = rejectionReason;
    }
  } else if (status === 'withdrawn') {
    // Only proposal owner can withdraw
    if (proposal.freelancer._id.toString() !== req.user._id.toString()) {
      return sendForbidden(res, 'Only the proposal owner can withdraw');
    }

    proposal.status = 'withdrawn';
    proposal.withdrawnAt = new Date();
  }

  await proposal.save();

  sendSuccess(res, 200, 'Proposal updated successfully', proposal);
});

export default updateProposal;

