import Proposal from '../../models/proposal.model.js';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/responseHandler.js';

/**
 * Get all proposals (Admin)
 * @route GET /api/v1/admin/proposals
 * @access Private (Admin only)
 */
export const getAllProposals = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    // Build query
    const query = {};

    if (status && status !== 'all') {
        query.status = status;
    }

    // Search by cover letter content or bid amount (basic search)
    // Note: Searching by freelancer name would require a more complex aggregation or population query
    if (search) {
        query.$or = [
            { coverLetter: { $regex: search, $options: 'i' } }
        ];
    }

    const proposals = await Proposal.find(query)
        .populate('freelancer', 'firstName lastName email avatar')
        .populate('job', 'title budget')
        .populate('client', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Proposal.countDocuments(query);

    sendSuccess(res, 200, 'Proposals fetched successfully', {
        proposals,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});
