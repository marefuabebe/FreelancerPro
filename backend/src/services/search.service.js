import Job from '../models/job.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * Search Service
 */
class SearchService {
  /**
   * Search jobs
   */
  async searchJobs({
    query,
    category,
    skills,
    budgetMin,
    budgetMax,
    budgetType,
    experienceLevel,
    duration,
    location,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    try {
      const filter = { status: 'open' };

      // Text search
      if (query) {
        filter.$text = { $search: query };
      }

      // Category filter
      if (category) {
        filter.category = category;
      }

      // Skills filter
      if (skills && skills.length > 0) {
        filter.skills = { $in: skills };
      }

      // Budget filter
      if (budgetMin || budgetMax) {
        filter['budget.amount'] = {};
        if (budgetMin) filter['budget.amount'].$gte = parseFloat(budgetMin);
        if (budgetMax) filter['budget.amount'].$lte = parseFloat(budgetMax);
      }

      if (budgetType) {
        filter['budget.type'] = budgetType;
      }

      // Experience level filter
      if (experienceLevel) {
        filter.experienceLevel = experienceLevel;
      }

      // Duration filter
      if (duration) {
        filter.duration = duration;
      }

      // Location filter
      if (location) {
        filter['location.country'] = location;
      }

      // Sorting
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const jobs = await Job.find(filter)
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('client', 'firstName lastName avatar rating')
        .lean();

      const total = await Job.countDocuments(filter);

      return {
        jobs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Job search failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search freelancers
   */
  async searchFreelancers({
    query,
    category,
    skills,
    minRate,
    maxRate,
    location,
    availability,
    page = 1,
    limit = 20,
    sortBy = 'rating.average',
    sortOrder = 'desc',
  }) {
    try {
      const filter = {
        role: 'freelancer',
        isActive: true,
        emailVerified: true,
      };

      // Category filter - map category names to relevant skills/titles
      if (category) {
        const categoryKeywords = this._getCategoryKeywords(category);
        if (categoryKeywords.length > 0) {
          filter.$or = [
            { skills: { $in: categoryKeywords } },
            { professionalTitle: { $regex: categoryKeywords.join('|'), $options: 'i' } },
          ];
        }
      }

      // Skills filter
      if (skills) {
        // Handle both array and comma-separated string
        const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        if (skillsArray.length > 0) {
          // If category filter exists, combine with AND logic
          if (filter.$or) {
            filter.$and = [
              { $or: filter.$or },
              { skills: { $in: skillsArray } }
            ];
            delete filter.$or;
          } else {
            filter.skills = { $in: skillsArray };
          }
        }
      }

      // Rate filter
      if (minRate || maxRate) {
        filter.hourlyRate = {};
        if (minRate) filter.hourlyRate.$gte = parseFloat(minRate);
        if (maxRate) filter.hourlyRate.$lte = parseFloat(maxRate);
      }

      // Location filter
      if (location) {
        filter['location.country'] = location;
      }

      // Availability filter
      if (availability) {
        filter['availability.status'] = availability;
      }

      // Text search
      if (query) {
        filter.$or = [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
          { skills: { $in: [new RegExp(query, 'i')] } },
        ];
      }

      // Sorting
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const freelancers = await User.find(filter)
        .select('-password -refreshToken')
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const total = await User.countDocuments(filter);

      return {
        freelancers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Freelancer search failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get job suggestions based on user skills
   */
  async getJobSuggestions(userId, limit = 10) {
    try {
      const user = await User.findById(userId);

      if (!user || !user.skills || user.skills.length === 0) {
        return [];
      }

      const jobs = await Job.find({
        status: 'open',
        skills: { $in: user.skills },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('client', 'firstName lastName avatar rating')
        .lean();

      return jobs;
    } catch (error) {
      logger.error(`Job suggestions failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get trending skills
   */
  async getTrendingSkills(limit = 20) {
    try {
      const skills = await Job.aggregate([
        { $match: { status: 'open' } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);

      return skills.map((s) => ({ skill: s._id, count: s.count }));
    } catch (error) {
      logger.error(`Trending skills fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get job categories
   */
  async getCategories() {
    try {
      const categories = await Job.distinct('category');
      return categories;
    } catch (error) {
      logger.error(`Categories fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map category names to relevant keywords
   * @private
   */
  _getCategoryKeywords(category) {
    const categoryMap = {
      'Development & IT': ['React', 'Node.js', 'JavaScript', 'Python', 'Java', 'PHP', 'MongoDB', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'DevOps', 'Full Stack', 'Frontend', 'Backend', 'Mobile', 'iOS', 'Android', 'Flutter', 'React Native', 'Vue', 'Angular', 'TypeScript', 'C++', 'C#', '.NET', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Database', 'API', 'Web Development', 'Software Development', 'Developer', 'Engineer', 'Programming'],
      'Design & Creative': ['UI/UX', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Graphic Design', 'Logo Design', 'Brand Identity', 'Web Design', 'Mobile Design', 'Product Design', 'Visual Design', 'Prototyping', 'Wireframing', 'Animation', 'Motion Graphics', 'Video Editing', 'After Effects', 'Premiere Pro', 'InDesign', 'Sketch', 'Canva', 'Designer', 'Creative'],
      'AI Services': ['Machine Learning', 'Deep Learning', 'AI', 'Artificial Intelligence', 'TensorFlow', 'PyTorch', 'Neural Networks', 'NLP', 'Natural Language Processing', 'Computer Vision', 'Data Science', 'AI Development', 'AI Chatbot', 'GPT', 'LLM', 'AI Engineer', 'ML Engineer'],
      'Sales & Marketing': ['SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Digital Marketing', 'Marketing Strategy', 'Lead Generation', 'Sales', 'CRM', 'Analytics', 'Google Analytics', 'Marketing Automation', 'Copywriting', 'Social Media', 'Instagram', 'LinkedIn', 'Twitter', 'Marketing'],
      'Writing & Translation': ['Content Writing', 'Copywriting', 'Blog Writing', 'Technical Writing', 'Creative Writing', 'Editing', 'Proofreading', 'Translation', 'Transcription', 'SEO Writing', 'Article Writing', 'Ghostwriting', 'Writer', 'Editor', 'Translator'],
      'Admin & Support': ['Virtual Assistant', 'Data Entry', 'Customer Support', 'Administrative Support', 'Email Management', 'Calendar Management', 'Research', 'Documentation', 'Project Management', 'Office Management', 'Assistant', 'Support'],
      'Finance & Accounting': ['Accounting', 'Bookkeeping', 'Financial Analysis', 'QuickBooks', 'Xero', 'Tax Preparation', 'Financial Planning', 'Budgeting', 'Payroll', 'Auditing', 'CPA', 'Finance', 'Accountant', 'Financial Analyst'],
      'Legal': ['Legal', 'Contract Law', 'Corporate Law', 'Legal Research', 'Legal Writing', 'Paralegal', 'Compliance', 'Intellectual Property', 'Patent', 'Trademark', 'Lawyer', 'Attorney', 'Legal Consultant'],
      'HR & Training': ['Human Resources', 'Recruiting', 'Talent Acquisition', 'Training', 'Employee Development', 'HR Management', 'Onboarding', 'Performance Management', 'Compensation', 'Benefits', 'HR Consultant', 'Recruiter', 'Trainer'],
      'Engineering & Architecture': ['Architecture', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'CAD', 'AutoCAD', 'SolidWorks', '3D Modeling', 'Structural Engineering', 'Product Design', 'Industrial Design', 'Engineer', 'Architect']
    };

    return categoryMap[category] || [];
  }
}

export default new SearchService();

