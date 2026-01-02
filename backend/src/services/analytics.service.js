import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import Contract from '../models/contract.model.js';
import Transaction from '../models/transaction.model.js';
import logger from '../utils/logger.js';

/**
 * Analytics Service
 */
class AnalyticsService {
  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    try {
      const [
        totalUsers,
        totalClients,
        totalFreelancers,
        totalJobs,
        activeJobs,
        completedJobs,
        totalContracts,
        activeContracts,
        totalTransactions,
        totalRevenue,
      ] = await Promise.all([
        User.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'client', isActive: true }),
        User.countDocuments({ role: 'freelancer', isActive: true }),
        Job.countDocuments(),
        Job.countDocuments({ status: 'open' }),
        Job.countDocuments({ status: 'completed' }),
        Contract.countDocuments(),
        Contract.countDocuments({ status: 'active' }),
        Transaction.countDocuments({ status: 'completed' }),
        Transaction.aggregate([
          { $match: { status: 'completed', type: 'payment' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

      // Calculate platform fee revenue
      const platformRevenue = await Transaction.aggregate([
        { $match: { status: 'completed', type: 'payment' } },
        { $group: { _id: null, total: { $sum: '$platformFee' } } },
      ]);

      // Get revenue over time (last 6 months)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const revenueOverTime = await this.getRevenueOverTime(startDate, endDate, 'month');
      const recentActivity = await this.getRecentActivity();

      return {
        users: {
          total: totalUsers,
          clients: totalClients,
          freelancers: totalFreelancers,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          completed: completedJobs,
        },
        contracts: {
          total: totalContracts,
          active: activeContracts,
        },
        transactions: {
          total: totalTransactions,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          platformFee: platformRevenue[0]?.total || 0,
        },
        revenueOverTime,
        recentActivity,
      };
    } catch (error) {
      logger.error(`Platform stats fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.role === 'client') {
        return this.getClientAnalytics(userId);
      } else if (user.role === 'freelancer') {
        return this.getFreelancerAnalytics(userId);
      }
    } catch (error) {
      logger.error(`User analytics fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get client analytics
   */
  async getClientAnalytics(clientId) {
    try {
      const [jobsPosted, activeJobs, completedJobs, totalSpent, activeContracts] =
        await Promise.all([
          Job.countDocuments({ client: clientId }),
          Job.countDocuments({ client: clientId, status: 'open' }),
          Job.countDocuments({ client: clientId, status: 'completed' }),
          Transaction.aggregate([
            { $match: { user: clientId, type: 'payment', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ]),
          Contract.countDocuments({ client: clientId, status: 'active' }),
        ]);

      return {
        jobs: {
          posted: jobsPosted,
          active: activeJobs,
          completed: completedJobs,
        },
        contracts: {
          active: activeContracts,
        },
        spending: {
          total: totalSpent[0]?.total || 0,
        },
      };
    } catch (error) {
      logger.error(`Client analytics fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get freelancer analytics
   */
  async getFreelancerAnalytics(freelancerId) {
    try {
      const [
        proposalsSubmitted,
        activeContracts,
        completedContracts,
        totalEarnings,
        avgRating,
      ] = await Promise.all([
        Contract.countDocuments({ freelancer: freelancerId }),
        Contract.countDocuments({ freelancer: freelancerId, status: 'active' }),
        Contract.countDocuments({ freelancer: freelancerId, status: 'completed' }),
        Transaction.aggregate([
          { $match: { to: freelancerId, type: 'payout', status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        User.findById(freelancerId).select('rating'),
      ]);

      return {
        proposals: {
          submitted: proposalsSubmitted,
        },
        contracts: {
          active: activeContracts,
          completed: completedContracts,
        },
        earnings: {
          total: totalEarnings[0]?.total || 0,
        },
        rating: {
          average: avgRating?.rating?.average || 0,
          count: avgRating?.rating?.count || 0,
        },
      };
    } catch (error) {
      logger.error(`Freelancer analytics fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get revenue over time
   */
  async getRevenueOverTime(startDate, endDate, groupBy = 'day') {
    try {
      const groupFormat = {
        day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        week: { $dateToString: { format: '%Y-W%V', date: '$createdAt' } },
        month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      };

      const revenue = await Transaction.aggregate([
        {
          $match: {
            status: 'completed',
            type: 'payment',
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
        {
          $group: {
            _id: groupFormat[groupBy],
            revenue: { $sum: '$amount' },
            platformFee: { $sum: '$platformFee' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return revenue;
    } catch (error) {
      logger.error(`Revenue over time fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity() {
    try {
      const [recentUsers, recentJobs, recentContracts, recentTransactions] = await Promise.all([
        User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName role createdAt'),
        Job.find().sort({ createdAt: -1 }).limit(5).select('title client createdAt'),
        Contract.find().sort({ createdAt: -1 }).limit(5).select('title client freelancer createdAt'),
        Transaction.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(5).select('type amount user createdAt'),
      ]);

      const activities = [
        ...recentUsers.map(u => ({
          type: 'user_registration',
          action: 'New user registration',
          user: `${u.firstName} ${u.lastName}`,
          details: u.role,
          createdAt: u.createdAt,
        })),
        ...recentJobs.map(j => ({
          type: 'job_posted',
          action: 'Job posted',
          user: 'Client', // Ideally fetch client name, but keeping it simple for now or populate
          details: j.title,
          createdAt: j.createdAt,
        })),
        ...recentContracts.map(c => ({
          type: 'contract_signed',
          action: 'Contract signed',
          user: 'Users', // Placeholder
          details: c.title,
          createdAt: c.createdAt,
        })),
        ...recentTransactions.map(t => ({
          type: 'payment',
          action: 'Payment processed',
          user: 'User', // Placeholder
          details: `$${t.amount} - ${t.type}`,
          createdAt: t.createdAt,
        })),
      ];

      // Sort by date desc and take top 10
      return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    } catch (error) {
      logger.error(`Recent activity fetch failed: ${error.message}`);
      return [];
    }
  }
}

export default new AnalyticsService();

