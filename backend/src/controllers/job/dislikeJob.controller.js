import Job from '../../models/job.model.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Dislike/Undislike a job
 * @route POST /api/v1/jobs/:jobId/dislike
 * @access Private
 */
export const dislikeJob = catchAsync(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);

    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Initialize arrays if they don't exist
    if (!job.savedBy) job.savedBy = [];
    if (!job.dislikedBy) job.dislikedBy = [];

    const isDisliked = job.dislikedBy.some(id => id.equals(userId));

    if (isDisliked) {
        // Remove dislike
        job.dislikedBy = job.dislikedBy.filter(id => !id.equals(userId));
    } else {
        // Dislike - add to dislikedBy
        job.dislikedBy.push(userId);
        // Remove from savedBy if present
        job.savedBy = job.savedBy.filter(id => !id.equals(userId));
    }

    await job.save();

    sendSuccess(res, 200, isDisliked ? 'Job undisliked' : 'Job disliked', {
        disliked: !isDisliked,
        jobId: job._id,
    });
});

export default dislikeJob;
