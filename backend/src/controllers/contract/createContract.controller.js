import Contract from '../../models/contract.model.js';
import Proposal from '../../models/proposal.model.js';
import Job from '../../models/job.model.js';
import { sendCreated, sendNotFound, sendBadRequest } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueEmail } from '../../jobs/emailQueue.js';
import { queueNotification } from '../../jobs/notificationQueue.js';

/**
 * Create contract from accepted proposal
 * @route POST /api/v1/contracts
 * @access Private - Client only
 */
export const createContract = catchAsync(async (req, res) => {
  const { proposalId, startDate, endDate, terms } = req.body;

  const proposal = await Proposal.findById(proposalId)
    .populate('job')
    .populate('freelancer');

  if (!proposal) {
    return sendNotFound(res, 'Proposal not found');
  }

  if (proposal.status !== 'accepted') {
    return sendBadRequest(res, 'Only accepted proposals can be converted to contracts');
  }

  const job = await Job.findById(proposal.job._id).populate('client');

  const contract = await Contract.create({
    job: job._id,
    proposal: proposal._id,
    client: job.client._id,
    freelancer: proposal.freelancer._id,
    title: job.title,
    description: job.description,
    contractType: proposal.proposedRate.type,
    amount: proposal.proposedRate.amount,
    currency: proposal.proposedRate.currency,
    hourlyRate: proposal.proposedRate.type === 'hourly' ? proposal.proposedRate.amount : undefined,
    startDate,
    endDate,
    terms,
    status: 'draft',
  });

  // Notify both parties
  await queueEmail('contract_created', {
    client: job.client,
    freelancer: proposal.freelancer,
    contract,
  });

  await queueNotification('contract_created', {
    recipientId: proposal.freelancer._id,
    senderId: req.user._id,
    contractId: contract._id,
  });

  sendCreated(res, 'Contract created successfully', contract);
});

export default createContract;

