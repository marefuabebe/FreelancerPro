import Job from '../../models/job.model.js';
import { sendCreated } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueNotification } from '../../jobs/notificationQueue.js';
import matchingService from '../../services/matching.service.js';

/**
 * Create a new job
 * @route POST /api/v1/jobs
 * @access Private - Client only
 */
export const createJob = catchAsync(async (req, res) => {
  const jobData = {
    ...req.body,
    client: req.user._id,
  };

  const job = await Job.create(jobData);

  // Find matching freelancers and notify them
  const matchedFreelancers = await matchingService.findMatchingFreelancers(job._id, 5);

  // Queue notifications for matched freelancers
  for (const freelancer of matchedFreelancers) {
    await queueNotification('job_invitation', {
      freelancerId: freelancer._id,
      clientId: req.user._id,
      jobId: job._id,
    });
  }

  // Update user onboarding status
  if (!req.user.onboardingCompleted) {
    req.user.onboardingCompleted = true;
    await req.user.save();
  }

  sendCreated(res, 'Job created successfully', { job, user: req.user });
});

export default createJob;

