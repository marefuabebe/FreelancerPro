import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Shield, Clock, Calendar, ChevronRight, ChevronDown, Check, Flag, Share2, Heart } from 'lucide-react';
import api from '../api/axiosInstance.js';
import FreelancerProFooter from '../components/common/UpworkFooter.jsx';

export default function ConsultationDetails() {
    const { freelancerId } = useParams();
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(30);

    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                console.log('Fetching freelancer with ID:', freelancerId);
                const { data } = await api.get(`/users/${freelancerId}`);
                console.log('Freelancer data received:', data);

                // Handle different response structures
                const freelancerData = data.data?.user || data.data || data.user || data;
                console.log('Processed freelancer data:', freelancerData);

                if (!freelancerData || !freelancerData._id) {
                    throw new Error('Invalid freelancer data received');
                }

                setFreelancer(freelancerData);
            } catch (err) {
                console.error('Failed to fetch freelancer:', err);
                console.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);

                const errorMessage = err.response?.data?.message || err.message || 'Failed to load freelancer details.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (freelancerId) {
            fetchFreelancer();
        } else {
            setError('No freelancer ID provided');
            setLoading(false);
        }
    }, [freelancerId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading consultation details...</p>
                </div>
            </div>
        );
    }

    if (error || !freelancer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-red-600 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Freelancer Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The freelancer you are looking for could not be found.'}</p>
                    <button
                        onClick={() => navigate('/nx/search/talent?offer_consultations=true')}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Browse Other Consultants
                    </button>
                </div>
            </div>
        );
    }

    const rate30 = freelancer.hourlyRate ? Math.round(freelancer.hourlyRate / 2) : 15;
    const rate60 = freelancer.hourlyRate || 30;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb - Mocked */}
                <div className="text-sm text-gray-500 mb-6">
                    <span className="hover:underline cursor-pointer">Home</span> / <span className="hover:underline cursor-pointer">Consultations</span> / <span className="text-gray-900">{freelancer.professionalTitle}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Header Image */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <h1 className="text-3xl font-bold">Service</h1>
                            </div>
                        </div>

                        {/* Freelancer Header */}
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <img
                                    src={freelancer.avatar?.url || `https://ui-avatars.com/api/?name=${freelancer.firstName}+${freelancer.lastName}&background=random`}
                                    alt={`${freelancer.firstName} ${freelancer.lastName}`}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full">
                                    <Shield className="w-3 h-3 fill-current" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {freelancer.firstName} {freelancer.lastName.charAt(0)}.
                                </h2>
                                <h3 className="text-xl text-gray-800 font-medium mt-1">
                                    {freelancer.professionalTitle}
                                </h3>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose max-w-none text-gray-700">
                            <p className="whitespace-pre-line">{freelancer.bio}</p>
                        </div>

                        {/* What to expect */}
                        <div className="border-t border-gray-200 pt-6">
                            <button className="flex items-center justify-between w-full group">
                                <h3 className="text-xl font-semibold text-gray-900">What to expect</h3>
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Reviews Section */}
                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                Reviews ({freelancer.rating?.count || 0})
                            </h3>
                            {/* Mock Reviews */}
                            <div className="space-y-6">
                                {[1, 2].map((review) => (
                                    <div key={review} className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                                {review === 1 ? 'TB' : 'KA'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{review === 1 ? 'Tim B.' : 'Konstantinos A.'}</p>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Star className="w-3 h-3 text-green-600 fill-current" />
                                                    <span className="font-bold text-gray-900">5.0</span>
                                                    <span>• Nov {20 - review}, 2025</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 italic">
                                            "{review === 1 ? 'Clearly knows his stuff and got all issues resolved quickly - highly recommend!' : 'Great communication and excellent work on the DNS records.'}"
                                        </p>
                                    </div>
                                ))}
                                <button className="text-green-600 font-medium hover:underline">
                                    See more reviews
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose how long to meet</h3>

                            <div className="space-y-3 mb-6">
                                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedDuration === 30 ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-300 hover:border-gray-400'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedDuration === 30 ? 'border-green-600' : 'border-gray-400'}`}>
                                            {selectedDuration === 30 && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                                        </div>
                                        <span className="font-medium text-gray-900">30 minutes</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">${rate30}</span>
                                    <input
                                        type="radio"
                                        name="duration"
                                        className="hidden"
                                        checked={selectedDuration === 30}
                                        onChange={() => setSelectedDuration(30)}
                                    />
                                </label>

                                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedDuration === 60 ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-300 hover:border-gray-400'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedDuration === 60 ? 'border-green-600' : 'border-gray-400'}`}>
                                            {selectedDuration === 60 && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                                        </div>
                                        <span className="font-medium text-gray-900">60 minutes</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">${rate60}</span>
                                    <input
                                        type="radio"
                                        name="duration"
                                        className="hidden"
                                        checked={selectedDuration === 60}
                                        onChange={() => setSelectedDuration(60)}
                                    />
                                </label>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-2">Sunday, Nov 30</h4>
                                <p className="text-xs text-gray-500 mb-3">Pacific Standard Time (PST)</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">10:30 PM</button>
                                    <button className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">11:00 PM</button>
                                    <button className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">11:30 PM</button>
                                </div>
                                <button className="text-green-600 text-sm font-medium mt-3 hover:underline">See more times</button>
                            </div>

                            <button
                                onClick={() => {
                                    // Navigate to payment page with consultation details
                                    navigate('/payments', {
                                        state: {
                                            type: 'consultation',
                                            freelancerId: freelancer._id,
                                            freelancerName: `${freelancer.firstName} ${freelancer.lastName}`,
                                            duration: selectedDuration,
                                            amount: selectedDuration === 30 ? rate30 : rate60,
                                            description: `${selectedDuration} minute consultation with ${freelancer.firstName} ${freelancer.lastName}`
                                        }
                                    });
                                }}
                                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors mb-4"
                            >
                                Continue (${selectedDuration === 30 ? rate30 : rate60})
                            </button>

                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                <div className="mt-0.5"><Share2 className="w-3 h-3" /></div>
                                <p>You can share details and message {freelancer.firstName} after checkout.</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
                                <button className="flex items-center gap-1 text-green-600 font-medium text-sm hover:underline">
                                    <Heart className="w-4 h-4" /> Save
                                </button>
                                <button className="flex items-center gap-1 text-green-600 font-medium text-sm hover:underline">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="flex items-center gap-1 text-green-600 font-medium text-sm hover:underline">
                                    <Flag className="w-4 h-4" /> Report
                                </button>
                            </div>
                        </div>

                        {/* About the freelancer sidebar */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">About the freelancer</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={freelancer.avatar?.url || `https://ui-avatars.com/api/?name=${freelancer.firstName}+${freelancer.lastName}&background=random`}
                                    alt={`${freelancer.firstName} ${freelancer.lastName}`}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium text-green-700">{freelancer.firstName} {freelancer.lastName.charAt(0)}.</p>
                                    <p className="text-sm text-gray-500 line-clamp-1">{freelancer.professionalTitle}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span>Top Rated</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-blue-600" />
                                    <span>100% Job Success</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{freelancer.location?.city}, {freelancer.location?.country}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FreelancerProFooter className="mt-12" />
        </div>
    );
}
