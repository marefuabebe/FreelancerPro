import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore.js';
import { useUserStore } from '../store/useUserStore.js';
import ProfileCompletionModal from '../components/dashboard/ProfileCompletionModal.jsx';
import FreelancerProFooter from '../components/common/UpworkFooter.jsx';
import { Search, ThumbsDown, Heart, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { calculateProfileCompletion } from '../utils/profileCompletion.js';

function getItem(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        if (v && (v[0] === '[' || v[0] === '{')) return JSON.parse(v);
        return v || fallback;
    } catch {
        return fallback;
    }
}

export default function FindWorkBestMatches() {
    const { jobs, loading, fetchJobs } = useJobStore();
    const { profile, loadProfile } = useUserStore();
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
    const [promoteExpanded, setPromoteExpanded] = useState(true);
    const [connectsExpanded, setConnectsExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('best-matches');
    const [savedJobs, setSavedJobs] = useState(new Set());

    useEffect(() => {
        fetchJobs({ page: 1, limit: 20 });
        loadProfile(); // Always reload profile to get latest data including avatar
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run on mount only

    const { percentage: profileCompletion } = calculateProfileCompletion(profile);
    const userName = profile?.firstName || 'User';
    const userTitle = profile?.professionalTitle || 'Freelancer';
    const avatarUrl = profile?.avatar?.url || (typeof profile?.avatar === 'string' ? profile?.avatar : null);

    // Debug logging
    console.log('🔍 Dashboard Debug:', {
        hasProfile: !!profile,
        avatar: profile?.avatar,
        avatarUrl,
        profileCompletion
    });

    // Fallback if no avatar
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${userName}&background=10b981&color=fff&rounded=true&size=128`;

    const filteredJobs = jobs
        .filter(job => {
            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = (
                    job.title?.toLowerCase().includes(query) ||
                    job.description?.toLowerCase().includes(query) ||
                    job.skills?.some(skill => skill.toLowerCase().includes(query))
                );
                if (!matchesSearch) return false;
            }

            // Filter by active tab
            const jobId = job.id || job._id;
            if (activeTab === 'saved') {
                return savedJobs.has(jobId);
            }

            return true;
        })
        .sort((a, b) => {
            // Sort by active tab
            if (activeTab === 'most-recent') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0; // Default order for 'best-matches'
        });

    return (
        <div className="min-h-screen bg-white">
            <ProfileCompletionModal
                open={showCompleteProfileModal}
                onClose={() => setShowCompleteProfileModal(false)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Boosted Pro Card */}
                        <div className="bg-green-800 rounded-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Rise to the top of Boosted Pro earnings on</h3>
                                    <p className="text-green-100 text-sm">Get more visibility and win more jobs</p>
                                </div>
                                <button className="bg-white text-green-800 font-semibold px-6 py-2 rounded-lg hover:bg-green-50 transition-colors">
                                    Boost now
                                </button>
                            </div>
                        </div>

                        {/* Search for jobs */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for jobs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                            />
                        </div>

                        {/* Jobs Section Header */}
                        <div>
                            <p className="text-gray-900 mb-6">
                                Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex gap-8">
                                <button
                                    onClick={() => setActiveTab('best-matches')}
                                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'best-matches'
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Best Matches
                                    {activeTab === 'best-matches' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('most-recent')}
                                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'most-recent'
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Most Recent
                                    {activeTab === 'most-recent' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('saved')}
                                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'saved'
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Saved Jobs ({savedJobs.size})
                                    {activeTab === 'saved' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Jobs List */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredJobs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No jobs found. Try adjusting your search.</p>
                                    </div>
                                ) : (
                                    filteredJobs.map((job) => {
                                        const budgetType = job.budget?.type || 'Fixed-price';
                                        const budgetAmount = typeof job.budget === 'object' ? job.budget?.amount : job.budget;
                                        const experienceLevel = job.experienceLevel || 'Intermediate';
                                        const duration = job.duration || 'Less than 1 month';
                                        const hoursPerWeek = job.hoursPerWeek || 'Less than 30 hrs/week';
                                        const isHourly = budgetType.toLowerCase().includes('hourly');

                                        return (
                                            <div key={job.id || job._id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        {/* Job Title */}
                                                        <Link
                                                            to={`/jobs/${job.id || job._id}`}
                                                            className="text-xl font-semibold text-green-600 hover:text-green-700 mb-3 block break-words"
                                                        >
                                                            {job.title}
                                                        </Link>

                                                        {/* Client Info Row - Payment verified, Rating, Spent, Location */}
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap mb-3">
                                                            {/* Payment Verified */}
                                                            {job.client?.paymentVerified && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <span>Payment verified</span>
                                                                </div>
                                                            )}

                                                            {/* Rating Stars */}
                                                            {job.client?.rating && (
                                                                <div className="flex items-center gap-0.5">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <svg
                                                                            key={i}
                                                                            className={`w-4 h-4 ${i < Math.floor(job.client.rating)
                                                                                ? 'text-orange-400 fill-orange-400'
                                                                                : 'text-gray-300 fill-gray-300'
                                                                                }`}
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Amount Spent */}
                                                            {job.client?.totalSpent && (
                                                                <span>
                                                                    ${job.client.totalSpent >= 100000
                                                                        ? `${Math.floor(job.client.totalSpent / 1000)}K+`
                                                                        : `${job.client.totalSpent}+`} spent
                                                                </span>
                                                            )}

                                                            {/* Location */}
                                                            {job.location?.country && (
                                                                <div className="flex items-center gap-1">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span>{job.location.country}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Job Description */}
                                                        <p className="text-gray-700 mb-4 line-clamp-2 break-all">{job.description}</p>

                                                        {/* Skills Tags */}
                                                        {job.skills && job.skills.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {job.skills.slice(0, 5).map((skill, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full break-all"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                                {job.skills.length > 5 && (
                                                                    <span className="px-3 py-1 text-gray-500 text-sm">+{job.skills.length - 5} more</span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Proposals and Freelancers Needed */}
                                                        <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 mt-3 border-t">
                                                            <span>Proposals: <strong>{job.proposalsCount || 'Less than 5'}</strong></span>
                                                            {job.freelancersNeeded && (
                                                                <span>Number of freelancers needed: <strong>{job.freelancersNeeded}</strong></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // Thumbs down functionality can be added later
                                                            }}
                                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                        >
                                                            <ThumbsDown size={20} className="text-gray-400" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                const jobId = job.id || job._id;
                                                                setSavedJobs(prev => {
                                                                    const newSet = new Set(prev);
                                                                    if (newSet.has(jobId)) {
                                                                        newSet.delete(jobId);
                                                                    } else {
                                                                        newSet.add(jobId);
                                                                    }
                                                                    return newSet;
                                                                });
                                                            }}
                                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                        >
                                                            <Heart
                                                                size={20}
                                                                className={`transition-colors ${savedJobs.has(job.id || job._id)
                                                                    ? 'fill-red-700 text-red-700'
                                                                    : 'text-gray-400'
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Profile Summary */}
                        <div className="bg-white border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={avatarUrl || fallbackAvatar}
                                    alt={userName}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackAvatar; }}
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{userName}</div>
                                    <div className="text-sm text-gray-600">{userTitle}</div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600">Profile completion</span>
                                    <span className="font-semibold">{profileCompletion}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-600 rounded-full transition-all"
                                        style={{ width: `${profileCompletion}%` }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCompleteProfileModal(true)}
                                className="w-full mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Complete your profile
                            </button>
                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm font-semibold text-gray-900 mb-2">Identity verification</div>
                                <div className="text-xs text-gray-600">Verify your identity to build trust with clients</div>
                            </div>
                        </div>

                        {/* Promote with ads */}
                        <div className="bg-gray-50 border rounded-lg">
                            <button
                                onClick={() => setPromoteExpanded(!promoteExpanded)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <span className="font-semibold text-gray-900">Promote with ads</span>
                                {promoteExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {promoteExpanded && (
                                <div className="px-4 pb-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">Availability badge</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Off</span>
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <Pencil size={14} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">Boost your profile</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Off</span>
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <Pencil size={14} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connects */}
                        <div className="bg-gray-50 border rounded-lg">
                            <button
                                onClick={() => setConnectsExpanded(!connectsExpanded)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <span className="font-semibold text-gray-900">Connects: 0</span>
                                {connectsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {connectsExpanded && (
                                <div className="px-4 pb-4">
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-2 transition-colors">
                                        Buy Connects
                                    </button>
                                    <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                        View details
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FreelancerProFooter />
        </div>
    );
}

