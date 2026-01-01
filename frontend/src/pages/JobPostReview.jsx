import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { X, Edit2, Check, X as XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useJobStore } from '../store/useJobStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

export default function JobPostReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const createJob = useJobStore((state) => state.createJob);
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  // Refresh user data on component mount to get latest KYC status
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    };
    refreshUserData();
  }, [refreshUser]);

  // Get all job data from location.state (passed from previous steps)
  // Initialize local state for editing
  const [localJobData, setLocalJobData] = useState(location.state || {});

  // State for editing
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState(null);

  // Extract data with defaults from localJobData
  const {
    title = 'Creative Logo',
    summary = 'We are seeking a talented graphic designer...',
    category = 'Brand Identity Design',
    // Combine skills if not already present in 'skills' 
    skills = localJobData.skills || [
      ...(localJobData.mandatorySkills || []),
      ...(localJobData.niceSkills || []),
      ...(localJobData.tools || [])
    ].filter(Boolean),
    projectType = 'hourly',
    budgetFrom = '10.00',
    budgetTo = '100.00',
    fixedBudget = '',
    visibility = 'Public, including search engines',
    coworkers = [],
    files = [],
  } = localJobData;

  // Fallback to dummy skills only if absolutely no skills found from previous step
  if (skills.length === 0 && !localJobData.skills && !localJobData.mandatorySkills) {
    // Optional: set some defaults or leave empty. 
    // Keeping previous defaults if needed, but better to be empty if user entered nothing.
    // skills.push('Graphic Design', 'Logo Design'); 
  }

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field) => {
    setLocalJobData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
    setTempValue(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue(null);
  };

  const handleEditJobPost = () => {
    setShowModal(false);
    // Just close modal to allow editing on the page
  };

  const handlePostJob = async () => {
    setShowModal(false);
    await submitJobToBackend();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const submitJobToBackend = async () => {
    // Check verification status (skip in development)
    if (!import.meta.env.DEV && (!user?.emailVerified || !user?.kycVerified)) {
      const missingVerifications = [];
      if (!user?.emailVerified) missingVerifications.push('email verification');
      if (!user?.kycVerified) missingVerifications.push('identity verification (KYC)');

      const message = `Account verification required. Please complete ${missingVerifications.join(' and ')} before posting a job.`;
      setPostError(message);
      toast.error(message, { duration: 5000 });
      return;
    }

    if (!localJobData?.title || !localJobData?.summary) {
      const message = 'Missing job details. Please complete all fields.';
      setPostError(message);
      toast.error(message);
      return;
    }
    const payload = buildJobPayload(localJobData);

    // Debug logging
    console.log('Job payload being sent:', payload);
    console.log('Attachments type:', typeof payload.attachments);
    console.log('Attachments is array:', Array.isArray(payload.attachments));
    console.log('Attachments content:', JSON.stringify(payload.attachments, null, 2));

    // Validate attachments are not stringified
    if (payload.attachments && Array.isArray(payload.attachments)) {
      payload.attachments.forEach((att, index) => {
        if (typeof att === 'string') {
          console.error(`Attachment at index ${index} is a string, should be object:`, att);
        }
      });
    }

    if (!payload.budget.amount) {
      const message = 'Please provide a budget greater than 0 before posting your job.';
      setPostError(message);
      toast.error(message);
      return;
    }
    setPosting(true);
    setPostError(null);
    try {
      const createdJob = await createJob(payload);
      const createdId = createdJob?.id || createdJob?._id || jobId;
      toast.success('Job posted successfully');
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/nx/client/dashboard', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Job post error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.response?.data?.message || error.message);
      let message = error.response?.data?.message || error.message || 'Failed to post job';

      // Handle Mongoose validation errors
      if (error.response?.data?.errors) {
        const details = Object.values(error.response.data.errors).map(err => err.message || err).join('. ');
        if (details) message += `: ${details}`;
      }

      // Show detailed error for debugging
      if (error.response?.data?.details) {
        console.error('Error details:', error.response.data.details);
        message += ` - ${JSON.stringify(error.response.data.details)}`;
      }

      setPostError(message);
      toast.error(message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-blue-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          <span>Just a reminder to publish your job post, you'll need to verify your phone number</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job details</h1>
          <button
            onClick={handlePostJob}
            disabled={posting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {posting ? 'Posting…' : 'Post this job'}
          </button>
        </div>
        {postError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">{postError}</p>
                {(!user?.kycVerified || !user?.emailVerified) && (
                  <p className="text-xs text-red-600 mt-2">
                    Please complete the required verifications to post your job.
                  </p>
                )}
              </div>
              {!user?.kycVerified && (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Complete KYC Verification
                </button>
              )}
            </div>
          </div>
        )}

        {/* Job Details Sections */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Job Title */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Job title</h2>
              {editingField === 'title' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <button onClick={() => handleSave('title')} className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Check size={20} />
                  </button>
                  <button onClick={handleCancel} className="p-2 text-gray-400 hover:bg-gray-100 rounded">
                    <XIcon size={20} />
                  </button>
                </div>
              ) : (
                <p className="text-lg text-gray-900">{title}</p>
              )}
            </div>
            {editingField !== 'title' && (
              <button onClick={() => handleEditClick('title', title)} className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Edit2 size={18} />
              </button>
            )}
          </div>

          {/* Job Description */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Job description</h2>
              {editingField === 'summary' ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancel} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                      Cancel
                    </button>
                    <button onClick={() => handleSave('summary')} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-base text-gray-700 whitespace-pre-wrap">{summary}</p>
              )}
            </div>
            {editingField !== 'summary' && (
              <button onClick={() => handleEditClick('summary', summary)} className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Edit2 size={18} />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Category</h2>
              {editingField === 'category' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <button onClick={() => handleSave('category')} className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Check size={20} />
                  </button>
                  <button onClick={handleCancel} className="p-2 text-gray-400 hover:bg-gray-100 rounded">
                    <XIcon size={20} />
                  </button>
                </div>
              ) : (
                <p className="text-base text-gray-900">{category}</p>
              )}
            </div>
            {editingField !== 'category' && (
              <button onClick={() => handleEditClick('category', category)} className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Edit2 size={18} />
              </button>
            )}
          </div>

          {/* Skills */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Skills</h2>
              {editingField === 'skills' ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500">Separate skills with commas</p>
                  <input
                    type="text"
                    value={Array.isArray(tempValue) ? tempValue.join(', ') : tempValue}
                    onChange={(e) => setTempValue(e.target.value.split(',').map(s => s.trim()))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancel} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                      Cancel
                    </button>
                    <button onClick={() => handleSave('skills')} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {editingField !== 'skills' && (
              <button onClick={() => handleEditClick('skills', skills)} className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Edit2 size={18} />
              </button>
            )}
          </div>

          {/* Budget */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Budget</h2>
              <p className="text-base text-gray-900">
                {projectType === 'hourly'
                  ? `$${budgetFrom} - $${budgetTo} / hour`
                  : `$${fixedBudget || 'Not set'} (Fixed price)`
                }
              </p>
            </div>
            <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
              <Edit2 size={18} />
            </button>
          </div>

          {/* Visibility */}
          <div className="flex items-start justify-between pb-6 border-b">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Visibility</h2>
              <p className="text-base text-gray-900">{visibility}</p>
            </div>
            <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
              <Edit2 size={18} />
            </button>
          </div>

          {/* Sharing */}
          {coworkers.length > 0 && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Sharing</h2>
                <div className="flex flex-wrap gap-2">
                  {coworkers.map((email, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              </div>
              <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Clipboard illustration */}
                <svg width="120" height="120" viewBox="0 0 120 120" className="text-amber-700">
                  {/* Clipboard */}
                  <rect x="30" y="20" width="60" height="80" rx="4" fill="currentColor" />
                  <rect x="35" y="25" width="50" height="70" rx="2" fill="white" />
                  {/* Clip */}
                  <path d="M 50 20 Q 50 10 60 10 L 60 20 Z" fill="currentColor" />
                  {/* Checkmarks */}
                  <path d="M 42 40 L 48 46 L 58 36" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 42 55 L 48 61 L 58 51" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 42 70 L 48 76 L 58 66" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* Thumbs up hand */}
                <svg width="60" height="60" viewBox="0 0 60 60" className="absolute -bottom-2 -right-2 text-amber-600">
                  <path d="M 20 45 L 20 35 Q 20 25 25 20 Q 30 15 35 20 L 40 25 Q 45 30 45 35 L 45 50 Q 45 55 40 55 L 25 55 Q 20 55 20 50 Z" fill="currentColor" />
                  <circle cx="30" cy="30" r="3" fill="white" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              What happens after you post your job?
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 text-center mb-8">
              You'll receive proposals and you can invite talent to your job. No charges until you hire.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleEditJobPost}
                className="px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors text-lg"
              >
                Edit job post
              </button>
              <button
                onClick={handlePostJob}
                disabled={posting}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {posting ? 'Posting…' : 'Post your job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-12 relative text-center">
            {/* Illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Green board */}
                <svg width="200" height="240" viewBox="0 0 200 240" className="text-green-800">
                  {/* Board */}
                  <rect x="20" y="40" width="160" height="180" rx="8" fill="currentColor" />
                  {/* Paper pinned to board */}
                  <rect x="40" y="60" width="120" height="140" rx="4" fill="white" />
                  {/* Job Post text on paper */}
                  <text x="100" y="85" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
                    JOB POST
                  </text>
                  {/* Three lines on paper */}
                  <line x1="50" y1="100" x2="150" y2="100" stroke="#10b981" strokeWidth="2" />
                  <line x1="50" y1="120" x2="150" y2="120" stroke="#10b981" strokeWidth="2" />
                  <line x1="50" y1="140" x2="150" y2="140" stroke="#10b981" strokeWidth="2" />
                  {/* Pink thumbtack */}
                  <circle cx="50" cy="70" r="8" fill="#ec4899" />
                  <circle cx="50" cy="70" r="4" fill="#fce7f3" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Congratulations! Your job post is now live.
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

function buildJobPayload(jobData) {
  const projectType = jobData.projectType === 'fixed' ? 'fixed' : 'hourly';
  const skills = combineSkills(jobData.mandatorySkills, jobData.niceSkills, jobData.tools, jobData.skills);
  const hourlyCandidates = [toNumber(jobData.budgetFrom), toNumber(jobData.budgetTo)].filter((val) => typeof val === 'number');
  const hourlyAmount = hourlyCandidates.length ? Math.max(...hourlyCandidates) : null;
  const fixedAmount = toNumber(jobData.fixedBudget);

  // Ensure budget amount is always greater than 0
  const budgetAmount = projectType === 'fixed' ? (fixedAmount || 1) : (hourlyAmount || 1);

  // Parse attachments - handle multiple levels of stringification
  let attachments = jobData.files || [];

  console.log('Raw attachments from jobData:', attachments);
  console.log('Raw attachments type:', typeof attachments);

  // If it's a string, try to parse it
  if (typeof attachments === 'string') {
    try {
      attachments = JSON.parse(attachments);
      console.log('Parsed attachments from string:', attachments);
    } catch (e) {
      console.error('Failed to parse attachments string:', e);
      attachments = [];
    }
  }

  // Ensure attachments is an array
  if (!Array.isArray(attachments)) {
    console.warn('Attachments is not an array, converting to empty array');
    attachments = [];
  }

  // Check if the first element is a stringified array (double-wrapped case)
  if (attachments.length > 0 && typeof attachments[0] === 'string') {
    try {
      // Try to parse the first element as it might be a stringified array
      const parsed = JSON.parse(attachments[0]);
      if (Array.isArray(parsed)) {
        console.log('Detected double-wrapped attachments, unwrapping...');
        attachments = parsed;
      }
    } catch (e) {
      // Not a JSON string, keep as is
      console.log('First element is a string but not JSON, keeping as is');
    }
  }

  // Filter and clean attachments to ensure they have the required fields
  attachments = attachments
    .filter(file => file && typeof file === 'object' && !file.uploading)
    .map(file => ({
      url: file.url || '',
      publicId: file.publicId || '',
      name: file.name || '',
      size: file.size || 0,
      type: file.type || ''
    }));

  console.log('Final cleaned attachments:', attachments);

  return {
    title: jobData.title || 'Untitled Job',
    description: jobData.summary || jobData.description || 'Job details will be shared with shortlisted freelancers.',
    category: jobData.category || 'General',
    skills,
    budget: {
      type: projectType,
      amount: budgetAmount,
      currency: 'USD',
    },
    duration: normalizeDuration(jobData.duration),
    experienceLevel: normalizeExperienceLevel(jobData.experienceLevel),
    attachments,
  };
}

function normalizeExperienceLevel(level) {
  if (!level) return 'intermediate';
  const value = level.toLowerCase();
  if (value.includes('entry')) return 'entry';
  if (value.includes('expert')) return 'expert';
  return 'intermediate';
}

function normalizeDuration(duration) {
  if (!duration) return 'medium';
  const value = duration.toLowerCase();
  if (value.includes('less') || value.includes('1 month')) return 'short';
  if (value.includes('1 to 3') || value.includes('1-3')) return 'medium';
  return 'long';
}

function toNumber(value) {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

function combineSkills(...lists) {
  const combined = lists
    .filter(Array.isArray)
    .flat()
    .filter((skill) => typeof skill === 'string' && skill.trim().length)
    .map((skill) => skill.trim());
  if (!combined.length) return ['General'];
  return Array.from(new Set(combined));
}

