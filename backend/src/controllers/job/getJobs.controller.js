import Job from '../../models/job.model.js';
import { sendPaginatedResponse } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { getPagination } from '../../utils/helpers.js';

/**
 * Get all jobs with filters
 * @route GET /api/v1/jobs
 * @access Public
 */
export const getJobs = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status = 'open',
    category,
    experienceLevel,
    budgetType,
    sortBy = 'createdAt',
  } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (budgetType) filter['budget.type'] = budgetType;

  // If user is authenticated, can see their own jobs regardless of status
  if (req.user) {
    if (req.query.myJobs) {
      filter.client = req.user._id;
      delete filter.status; // Show all statuses for own jobs
    }
  }

  const pagination = getPagination(
    await Job.countDocuments(filter),
    parseInt(page),
    parseInt(limit)
  );

  const jobs = await Job.find(filter)
    .sort({ [sortBy]: -1 })
    .limit(pagination.limit)
    .skip(pagination.skip)
    .populate('client', 'firstName lastName avatar rating');

  sendPaginatedResponse(res, 200, 'Jobs fetched successfully', jobs, pagination);
});

export default getJobs;

