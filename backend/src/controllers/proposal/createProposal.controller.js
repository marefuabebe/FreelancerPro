import Proposal from '../../models/proposal.model.js';
import Job from '../../models/job.model.js';
import { sendCreated, sendNotFound, sendBadRequest } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { queueEmail } from '../../jobs/emailQueue.js';
import { queueNotification } from '../../jobs/notificationQueue.js';
import { uploadBufferToCloudinary } from '../../utils/uploadBuffer.js';

/**
 * Create a new proposal
 * @route POST /api/v1/proposals
 * @access Private - Freelancer only
 */
export const createProposal = catchAsync(async (req, res) => {
  let { jobId, coverLetter, proposedRate, duration, durationUnit, milestones } = req.body;

  // Parse proposedRate if it's a JSON string (from FormData)
  if (typeof proposedRate === 'string') {
    try {
      proposedRate = JSON.parse(proposedRate);
    } catch (error) {
      return sendBadRequest(res, 'Invalid proposedRate format');
    }
  }

  const job = await Job.findById(jobId).populate('client');

  if (!job) {
    return sendNotFound(res, 'Job not found');
  }

  if (job.status !== 'open') {
    return sendBadRequest(res, 'Job is not open for proposals');
  }

  // Handle file uploads if present
  let uploadedAttachments = [];
  if (req.files && req.files.length > 0) {
    console.log(`📎 Uploading ${req.files.length} file(s) to Cloudinary...`);
    try {
      const uploadPromises = req.files.map(async (file) => {
        console.log(`  - Uploading: ${file.originalname} (${file.size} bytes)`);
        const result = await uploadBufferToCloudinary(
          file.buffer,
          file.originalname,
          'proposal_attachments'
        );

        console.log(`  ✅ Uploaded: ${file.originalname} -> ${result.url}`);

        return {
          url: result.url,
          publicId: result.publicId,
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
        };
      });

      uploadedAttachments = await Promise.all(uploadPromises);
      console.log(`✅ All files uploaded successfully`);
      console.log('📋 uploadedAttachments:', JSON.stringify(uploadedAttachments, null, 2));
      console.log('📋 uploadedAttachments type:', typeof uploadedAttachments);
      console.log('📋 uploadedAttachments is array:', Array.isArray(uploadedAttachments));
    } catch (error) {
      console.error('❌ File upload error:', error);
      return sendBadRequest(res, 'Failed to upload files. Please try again.');
    }
  }

  console.log('🔍 About to create proposal with attachments:', uploadedAttachments);
  console.log('🔍 Attachments type:', typeof uploadedAttachments);
  console.log('🔍 Is array:', Array.isArray(uploadedAttachments));
  console.log('🔍 First attachment:', uploadedAttachments[0]);

  let proposal;
  try {
    proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user._id,
      coverLetter,
      proposedRate,
      duration,
      durationUnit,
      milestones,
      attachments: uploadedAttachments, // Only use uploaded files
    });
  } catch (error) {
    console.error('❌ Proposal creation error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Validation errors:', error.errors);
    return sendBadRequest(res, error.message || 'Failed to create proposal');
  }

  // Increment job proposal count
  job.proposals += 1;
  await job.save({ validateBeforeSave: false });

  // Notify client
  await queueEmail('proposal_received', {
    client: job.client,
    job,
    freelancer: req.user,
  });

  await queueNotification('proposal_received', {
    clientId: job.client._id,
    freelancerId: req.user._id,
    jobId: job._id,
    proposalId: proposal._id,
  });

  sendCreated(res, 'Proposal submitted successfully', proposal);
});

export default createProposal;
