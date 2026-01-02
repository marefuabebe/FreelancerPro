import Job from '../../models/job.model.js';
import { sendSuccess } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Like/Unlike a job
 * @route POST /api/v1/jobs/:jobId/like
 * @access Private
 */
export const likeJob = catchAsync(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);

    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Initialize arrays if they don't exist
    if (!job.savedBy) job.savedBy = [];
    if (!job.dislikedBy) job.dislikedBy = [];

    const isLiked = job.savedBy.some(id => id.equals(userId));

    if (isLiked) {
        // Unlike - remove from savedBy
        job.savedBy = job.savedBy.filter(id => !id.equals(userId));
    } else {
        // Like - add to savedBy
        job.savedBy.push(userId);
        // Remove from dislikedBy if present
        job.dislikedBy = job.dislikedBy.filter(id => !id.equals(userId));
    }

    await job.save();

    sendSuccess(res, 200, isLiked ? 'Job unliked' : 'Job liked', {
        liked: !isLiked,
        jobId: job._id,
    });
});

export default likeJob;
