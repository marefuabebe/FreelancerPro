import Contract from '../../models/contract.model.js';
import { sendPaginatedResponse } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { getPagination } from '../../utils/helpers.js';

export const getAllContracts = catchAsync(async (req, res) => {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    const pagination = getPagination(
        await Contract.countDocuments(filter),
        parseInt(page),
        parseInt(limit)
    );

    const contracts = await Contract.find(filter)
        .sort({ createdAt: -1 })
        .limit(pagination.limit)
        .skip(pagination.skip)
        .populate('client', 'firstName lastName email')
        .populate('freelancer', 'firstName lastName email');

    sendPaginatedResponse(res, 200, 'Contracts fetched successfully', contracts, pagination);
});
