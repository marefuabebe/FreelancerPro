import User from '../../models/user.model.js';
import { sendSuccess, sendNotFound } from '../../utils/responseHandler.js';
import catchAsync from '../../utils/catchAsync.js';
import { cleanObject } from '../../utils/helpers.js';

/**
 * Update user profile
 * @route PUT /api/v1/users/:id
 * @access Private
 */
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Fields that can be updated
  const allowedUpdates = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    bio: req.body.bio,
    skills: req.body.skills,
    languages: req.body.languages,
    hourlyRate: req.body.hourlyRate,
    location: req.body.location,
    education: req.body.education,
    experience: req.body.experience,
    certifications: req.body.certifications,
    availability: req.body.availability,
    preferences: req.body.preferences,
    preferences: req.body.preferences,
    onboardingPreferences: req.body.onboardingPreferences,
    resume: req.body.resume,
  };

  // Remove undefined fields
  const updateData = cleanObject(allowedUpdates);

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  sendSuccess(res, 200, 'Profile updated successfully', user);
});

export default updateUser;

