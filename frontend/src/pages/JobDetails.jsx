import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { MapPin, Clock, DollarSign, Calendar, Share2, Heart, Flag, CheckCircle, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedJob, loading, error, fetchJobById } = useJobStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) fetchJobById(id);
  }, [id, fetchJobById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!selectedJob) return null;

  const isClient = user?.role === 'client';
  const isOwner = isClient && selectedJob.client?._id === user?._id;
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 break-words">{selectedJob.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                  {selectedJob.category}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Posted {formatDistanceToNow(new Date(selectedJob.createdAt))} ago
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedJob.location?.type === 'remote' ? 'Remote' : selectedJob.location?.city || 'On-site'}
                </span>
              </div>

              <div className="prose max-w-none text-gray-800 mb-8 whitespace-pre-wrap break-words">
                {selectedJob.description}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills and Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity on this job</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Proposals:</span>
                  <span className="font-medium text-gray-900">{selectedJob.proposals || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last viewed by client:</span>
                  <span className="font-medium text-gray-900">
                    {selectedJob.lastViewed ? formatDistanceToNow(new Date(selectedJob.lastViewed)) + ' ago' : 'Not yet'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Interviewing:</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {isFreelancer && (
                <button
                  onClick={() => navigate(`/proposals/submit/${selectedJob._id || selectedJob.id}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4"
                >
                  Apply Now
                </button>
              )}

              {isOwner && (
                <button
                  onClick={() => navigate(`/jobs/${selectedJob._id}/edit`)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4"
                >
                  Edit Job
                </button>
              )}

              <button className="w-full border border-green-600 text-green-600 font-bold py-3 px-4 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Save Job
              </button>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Flag className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Flag as inappropriate</p>
                    <p className="text-sm text-gray-500">Submit a report</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the client</h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">5.00 of 12 reviews</span>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{selectedJob.client?.location?.country || 'United States'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Payment method verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>$10k+ total spent</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">Member since Nov 2023</p>
              </div>
            </div>

            {/* Job Budget Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-gray-700" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedJob.budget?.type === 'hourly'
                      ? `$${selectedJob.budget.amount}/hr`
                      : `$${selectedJob.budget.amount}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedJob.budget?.type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Calendar className="w-6 h-6 text-gray-700" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedJob.duration || 'Medium term'}</p>
                  <p className="text-sm text-gray-500">Project Duration</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-700 font-bold text-xs">
                  {selectedJob.experienceLevel === 'expert' ? '$$$' : selectedJob.experienceLevel === 'intermediate' ? '$$' : '$'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 capitalize">{selectedJob.experienceLevel}</p>
                  <p className="text-sm text-gray-500">Experience Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
