import Job from '../models/job.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * Matching Service - Match freelancers with jobs
 */
class MatchingService {
  /**
   * Calculate match score between freelancer and job
   */
  calculateMatchScore(freelancer, job) {
    let score = 0;
    const weights = {
      skills: 40,
      experienceLevel: 20,
      budget: 20,
      rating: 10,
      completedJobs: 10,
    };

    // Skills match
    const matchingSkills = job.skills.filter((skill) =>
      freelancer.skills.some((fSkill) => fSkill.toLowerCase() === skill.toLowerCase())
    );
    const skillsScore = (matchingSkills.length / job.skills.length) * weights.skills;
    score += skillsScore;

    // Experience level match
    const experienceLevels = { entry: 1, intermediate: 2, expert: 3 };
    const freelancerLevel = freelancer.completedJobs > 50 ? 3 : freelancer.completedJobs > 10 ? 2 : 1;
    const requiredLevel = experienceLevels[job.experienceLevel] || 2;

    if (freelancerLevel >= requiredLevel) {
      score += weights.experienceLevel;
    } else {
      score += (freelancerLevel / requiredLevel) * weights.experienceLevel;
    }

    // Budget match (hourly rate vs job budget)
    if (job.budget.type === 'hourly' && freelancer.hourlyRate) {
      if (freelancer.hourlyRate <= job.budget.amount) {
        score += weights.budget;
      } else {
        const ratio = job.budget.amount / freelancer.hourlyRate;
        score += ratio * weights.budget;
      }
    } else {
      score += weights.budget * 0.5; // Partial credit for fixed price
    }

    // Rating score
    const ratingScore = (freelancer.rating.average / 5) * weights.rating;
    score += ratingScore;

    // Completed jobs score
    const completedJobsScore =
      Math.min(freelancer.completedJobs / 20, 1) * weights.completedJobs;
    score += completedJobsScore;

    return Math.round(score);
  }

  /**
   * Find matching freelancers for a job
   */
  async findMatchingFreelancers(jobId, limit = 20) {
    try {
      const job = await Job.findById(jobId);

      if (!job) {
        throw new Error('Job not found');
      }

      // Find freelancers with matching skills
      const freelancers = await User.find({
        role: 'freelancer',
        isActive: true,
        emailVerified: true,
        skills: { $in: job.skills },
        'availability.status': 'available',
      })
        .select('-password -refreshToken')
        .lean();

      // Calculate match scores
      const matchedFreelancers = freelancers
        .map((freelancer) => ({
          ...freelancer,
          matchScore: this.calculateMatchScore(freelancer, job),
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return matchedFreelancers;
    } catch (error) {
      logger.error(`Freelancer matching failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find matching jobs for a freelancer
   */
  async findMatchingJobs(userId, limit = 20) {
    try {
      const freelancer = await User.findById(userId);

      if (!freelancer || freelancer.role !== 'freelancer') {
        throw new Error('Freelancer not found');
      }

      if (!freelancer.skills || freelancer.skills.length === 0) {
        return [];
      }

      // Find jobs with matching skills
      const jobs = await Job.find({
        status: 'open',
        skills: { $in: freelancer.skills },
      })
        .populate('client', 'firstName lastName avatar rating')
        .lean();

      // Calculate match scores
      const matchedJobs = jobs
        .map((job) => ({
          ...job,
          matchScore: this.calculateMatchScore(freelancer, job),
        }))
        .filter((job) => job.matchScore >= 30) // Minimum 30% match
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return matchedJobs;
    } catch (error) {
      logger.error(`Job matching failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get recommended freelancers for job invitation
   */
  async getRecommendedFreelancers(jobId, count = 5) {
    const matches = await this.findMatchingFreelancers(jobId, count * 2);

    // Filter for high quality freelancers
    return matches
      .filter(
        (freelancer) =>
          freelancer.matchScore >= 50 &&
          freelancer.rating.average >= 4.0 &&
          freelancer.completedJobs >= 3
      )
      .slice(0, count);
  }
}

export default new MatchingService();

