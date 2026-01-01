import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Star, ChevronDown, ChevronUp, Filter, X, Video, Clock } from 'lucide-react';
import FreelancerProFooter from '../components/common/UpworkFooter.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import api from '../api/axiosInstance.js';

export default function SearchTalent() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        location: '',
        hourlyRate: { min: '', max: '' },
        talentQuality: {
            topRatedPlus: false,
            topRated: false,
            risingTalent: false
        },
        offersConsultations: searchParams.get('offer_consultations') === 'true'
    });

    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoading(true);
            try {
                const query = searchParams.get('q') || '';

                // Category to backend category mapping
                const categoryMap = {
                    'development it': 'Development & IT',
                    'ai services': 'AI Services',
                    'design': 'Design & Creative',
                    'marketing': 'Sales & Marketing',
                    'writing translation': 'Writing & Translation',
                    'administration': 'Admin & Support'
                };

                const params = {
                    limit: 20
                };

                // Check if query matches a category
                const normalizedQuery = query.toLowerCase().trim();
                const mappedCategory = categoryMap[normalizedQuery];

                if (mappedCategory) {
                    // Use category filter for category searches
                    params.category = mappedCategory;
                } else if (query) {
                    // Use text query for custom searches
                    params.q = query;
                }

                // Add other filters to params if needed
                if (filters.location) params.location = filters.location;

                const { data } = await api.get('/search/freelancers', { params });

                // Transform API data to match UI structure
                const mappedFreelancers = data.data.freelancers.map(f => ({
                    id: f._id,
                    name: `${f.firstName} ${f.lastName.charAt(0)}.`,
                    title: f.professionalTitle || 'Freelancer',
                    country: f.location?.country || 'Unknown',
                    rate: f.hourlyRate || 0,
                    rating: f.rating?.average || 0,
                    reviews: f.rating?.count || 0,
                    skills: f.skills || [],
                    avatar: f.avatar?.url || `https://ui-avatars.com/api/?name=${f.firstName}+${f.lastName}&background=random`,
                    badge: f.rating?.average > 4.8 ? 'Top Rated Plus' : (f.rating?.average > 4.5 ? 'Top Rated' : ''),
                    consultation: true,
                    bio: f.bio || ''
                }));

                setFreelancers(mappedFreelancers);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch freelancers:', err);
                setError('Failed to load freelancers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, [location.search, filters.location]); // Re-fetch when URL search or location filter changes

    const handleSearch = (e) => {
        e.preventDefault();
        // Update URL with new query
        const params = new URLSearchParams(location.search);
        if (searchQuery) {
            params.set('q', searchQuery);
        } else {
            params.delete('q');
        }
        navigate({ search: params.toString() });
    };

    const toggleFilter = (category, item) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [item]: !prev[category][item]
            }
        }));
    };

    return (
        <div className="min-h-screen bg-white flex flex-col dark:bg-slate-900 transition-colors duration-200">
            {/* Search Header */}
            <div className="border-b border-gray-200 bg-white sticky top-16 z-10 dark:bg-slate-900 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 text-gray-900"
                                placeholder="Search for talent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Search
                        </button>
                    </form>

                    {/* Active Filters */}
                    {filters.offersConsultations && (
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-slate-400">Active filters:</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black text-white dark:bg-white dark:text-black">
                                Offers consultations
                                <button
                                    type="button"
                                    className="ml-2 inline-flex items-center justify-center"
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, offersConsultations: false }));
                                        const params = new URLSearchParams(location.search);
                                        params.delete('offer_consultations');
                                        navigate({ search: params.toString() });
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Talent badge</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors dark:border-slate-600 dark:bg-slate-800"
                                        checked={filters.talentQuality.topRatedPlus}
                                        onChange={() => toggleFilter('talentQuality', 'topRatedPlus')}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-pink-50 rounded-full dark:bg-pink-900/30">
                                            <Star className="w-3 h-3 text-pink-500 fill-current" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-green-600 dark:text-slate-300 dark:group-hover:text-green-400">Top Rated Plus</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors dark:border-slate-600 dark:bg-slate-800"
                                        checked={filters.talentQuality.topRated}
                                        onChange={() => toggleFilter('talentQuality', 'topRated')}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-blue-50 rounded-full dark:bg-blue-900/30">
                                            <Star className="w-3 h-3 text-blue-500 fill-current" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-green-600 dark:text-slate-300 dark:group-hover:text-green-400">Top Rated</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors dark:border-slate-600 dark:bg-slate-800"
                                        checked={filters.talentQuality.risingTalent}
                                        onChange={() => toggleFilter('talentQuality', 'risingTalent')}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-green-50 rounded-full dark:bg-green-900/30">
                                            <Star className="w-3 h-3 text-green-500 fill-current" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-green-600 dark:text-slate-300 dark:group-hover:text-green-400">Rising Talent</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8 dark:border-slate-800">
                            <button className="flex items-center justify-between w-full group">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price per 30 min</h3>
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            </button>
                            <div className="mt-4 space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="price" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" defaultChecked />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">Any rate</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="price" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">$30 and below</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="price" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">$30 - $60</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="price" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">$60 & above</span>
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8 dark:border-slate-800">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Location</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="City, country or region"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 text-gray-900 bg-white"
                                    value={filters.location}
                                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8 dark:border-slate-800">
                            <button className="flex items-center justify-between w-full group">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Earned amount</h3>
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            </button>
                            <div className="mt-4 space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="earned" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" defaultChecked />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">Any amount earned</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="earned" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">$1+ earned</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="earned" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">$100+ earned</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="radio" name="earned" className="peer h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800" />
                                    </div>
                                    <span className="text-gray-700 dark:text-slate-300">$1K+ earned</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Results List */}
                    <div className="flex-1 space-y-8">
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {!loading && !error && freelancers.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                                <p className="text-xl font-medium">No freelancers found</p>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )}

                        {!loading && !error && freelancers.map((freelancer) => (
                            <div key={freelancer.id} className="bg-white border-b border-gray-200 pb-8 last:border-0 dark:bg-slate-900 dark:border-slate-800">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <img
                                                src={freelancer.avatar}
                                                alt={freelancer.name}
                                                className="w-14 h-14 rounded-full object-cover dark:border-slate-700"
                                            />
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full dark:border-slate-900"></div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 cursor-pointer mb-1 dark:text-white dark:hover:text-green-500">
                                                    {freelancer.name}
                                                </h3>
                                                <p className="text-gray-900 font-medium mb-1 text-base dark:text-slate-200">{freelancer.title}</p>
                                                <p className="text-sm text-gray-500 mb-4 dark:text-slate-400">{freelancer.country}</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button
                                                    onClick={() => navigate(`/consultation/${freelancer.id}`)}
                                                    className="w-full md:w-auto px-6 py-2 bg-white border border-green-600 text-green-600 font-medium rounded-full hover:bg-green-50 transition-colors dark:bg-slate-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-slate-700"
                                                >
                                                    Book a Consultation
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Video className="w-4 h-4 text-gray-400" />
                                                <span>${freelancer.rate} per 30 min Zoom meeting</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-green-600 fill-current" />
                                                <span className="font-medium text-gray-900 dark:text-slate-200">{freelancer.rating}</span>
                                                <span className="text-gray-500 dark:text-slate-500">({freelancer.reviews} reviews)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-medium">Next consultation time: Now</span>
                                            </div>
                                        </div>

                                        {/* Meeting Topics */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="text-sm font-medium text-gray-900 mt-1 dark:text-slate-200">Meeting topics:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {freelancer.skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bio Snippet */}
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 dark:text-slate-400">
                                            {freelancer.bio || "No bio available."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* People also searched for */}
                        <div className="pt-8 border-t border-gray-200 dark:border-slate-800">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">People also searched for</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="flex items-center gap-3 p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-left dark:bg-slate-800 dark:hover:bg-slate-700">
                                    <Search className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                                    <span className="text-gray-700 font-medium dark:text-slate-300">administration</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-left dark:bg-slate-800 dark:hover:bg-slate-700">
                                    <Search className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                                    <span className="text-gray-700 font-medium dark:text-slate-300">writing translation</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-left dark:bg-slate-800 dark:hover:bg-slate-700">
                                    <Search className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                                    <span className="text-gray-700 font-medium dark:text-slate-300">design</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-left dark:bg-slate-800 dark:hover:bg-slate-700">
                                    <Search className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                                    <span className="text-gray-700 font-medium dark:text-slate-300">digital marketing</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <FreelancerProFooter className="mx-4 md:mx-8 mb-4 rounded-2xl" />
        </div>
    );
}
