import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Briefcase, DollarSign, Clock, Award, CheckCircle } from 'lucide-react';
import api from '../api/axiosInstance.js';

export default function FreelancerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/users/${id}`);
                setFreelancer(response.data.data || response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load freelancer profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFreelancer();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-green-600 hover:text-green-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!freelancer) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Profile Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex items-start gap-6">
                                {freelancer.avatar ? (
                                    <img
                                        src={freelancer.avatar}
                                        alt={`${freelancer.firstName} ${freelancer.lastName}`}
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                                        {freelancer.firstName?.[0]}{freelancer.lastName?.[0]}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words">
                                        {freelancer.firstName} {freelancer.lastName}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-4 break-words overflow-wrap-anywhere">{freelancer.title || 'Freelancer'}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        {freelancer.location && (
                                            <span className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {freelancer.location.city || freelancer.location.country || 'Remote'}
                                            </span>
                                        )}
                                        {(freelancer.rating?.average !== undefined || typeof freelancer.rating === 'number') && (
                                            <span className="flex items-center">
                                                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                                {typeof freelancer.rating === 'number'
                                                    ? freelancer.rating.toFixed(1)
                                                    : (freelancer.rating?.average?.toFixed(1) || '0.0')} ({freelancer.rating?.count || freelancer.reviewCount || 0} reviews)
                                            </span>
                                        )}
                                        {freelancer.completedJobs !== undefined && (
                                            <span className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                                {freelancer.completedJobs} jobs completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {freelancer.bio && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap break-words overflow-wrap-anywhere">{freelancer.bio}</p>
                                </div>
                            )}

                            {freelancer.skills && freelancer.skills.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {freelancer.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium break-all max-w-full inline-block"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {freelancer.portfolio && freelancer.portfolio.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfolio</h3>
                                    <div className="space-y-3">
                                        {freelancer.portfolio.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <Award className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.title}</p>
                                                    {item.url && (
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-green-600 hover:text-green-700"
                                                        >
                                                            View Project →
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Rate Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <DollarSign className="w-6 h-6 text-gray-700" />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        ${freelancer.hourlyRate || 0}/hr
                                    </p>
                                    <p className="text-sm text-gray-500">Hourly Rate</p>
                                </div>
                            </div>

                            {(freelancer.availability?.status || typeof freelancer.availability === 'string') && (
                                <div className="flex items-center gap-3 mt-4">
                                    <Clock className="w-6 h-6 text-gray-700" />
                                    <div>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {typeof freelancer.availability === 'string'
                                                ? freelancer.availability
                                                : (freelancer.availability?.status || 'Available')}
                                        </p>
                                        <p className="text-sm text-gray-500">Availability</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Jobs Completed:</span>
                                    <span className="font-medium text-gray-900">{freelancer.completedJobs || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Earnings:</span>
                                    <span className="font-medium text-gray-900">${freelancer.totalEarnings || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Success Rate:</span>
                                    <span className="font-medium text-gray-900">{freelancer.successRate || 100}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Member Since:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(freelancer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(`/chat?user=${freelancer._id}`)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Message Freelancer
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back to Proposals
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
