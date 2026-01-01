import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { getJobs } from '../api/jobApi.js';
import {
    Plus,
    Search,
    CreditCard,
    Mail,
    Smartphone,
    Briefcase,
    ChevronRight,
    ChevronLeft,
    X,
    Code,
    Cpu,
    Palette,
    Megaphone,
    PenTool,
    Lock,
    MapPin,
    DollarSign,
    Clock,
    Users
} from 'lucide-react';

const iconMap = {
    'code': Code,
    'cpu': Cpu,
    'palette': Palette,
    'megaphone': Megaphone,
    'pen': PenTool,
    'briefcase': Briefcase
};

import FreelancerProFooter from '../components/common/UpworkFooter.jsx';

export default function ClientDashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    // Safeguard: Redirect to onboarding if not completed
    useEffect(() => {
        if (user && !user.onboardingCompleted) {
            navigate('/nx/job-post/chat');
        }
    }, [user, navigate]);

    // Fetch client's jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                // Use myJobs=true to fetch only the logged-in client's jobs
                const response = await getJobs({ myJobs: true, status: '' });
                const jobsData = response.data?.data || response.data || [];
                setJobs(Array.isArray(jobsData) ? jobsData : []);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchJobs();
        }
    }, [user?._id]);

    // Mock data for "Find experts" carousel
    const categories = [
        { name: 'Development & IT', color: 'bg-pink-400', icon: 'code', query: 'development it' },
        { name: 'AI Services', color: 'bg-green-600', icon: 'cpu', query: 'ai services' },
        { name: 'Design & Creative', color: 'bg-orange-400', icon: 'palette', query: 'design' },
        { name: 'Sales & Marketing', color: 'bg-blue-500', icon: 'megaphone', query: 'marketing' },
        { name: 'Writing & Translation', color: 'bg-purple-500', icon: 'pen', query: 'writing translation' },
        { name: 'Admin & Customer Support', color: 'bg-indigo-500', icon: 'briefcase', query: 'administration' },
    ];

    const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Client';
    const currentTime = new Date();
    const hour = currentTime.getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">

                {/* Upgrade Banner */}
                {showBanner && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-md shadow-sm">
                                <Briefcase className="text-green-600" size={20} />
                            </div>
                            <p className="text-sm text-gray-800">
                                <span className="font-semibold">Upgrade how you hire with Business Plus.</span> Get top 1% talent fast. Spend $1,000, get $500 credit.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-sm font-medium text-green-700 hover:text-green-800 underline">
                                Upgrade now
                            </button>
                            <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
                        {greeting}, {firstName}
                    </h1>
                    <Link
                        to="/nx/job-post/chat"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        Post a job
                    </Link>
                </div>

                {/* Checklist Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-medium text-gray-900 mb-6 dark:text-white">Last steps before you can hire</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Billing Method */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-sm text-gray-500">Required to hire</p>
                                <CreditCard className="text-gray-400" size={24} />
                            </div>
                            <Link to="/nx/payments/deposit-methods" className="text-lg font-medium text-gray-900 underline hover:text-green-600 mb-2 block">
                                Add a billing method
                            </Link>
                            <p className="text-sm text-gray-600">
                                This can increase your hiring speed by up to 3x. There's no cost until you hire.
                            </p>
                        </div>

                        {/* Email Verified */}
                        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-sm text-gray-500">Required to hire</p>
                                <Mail className="text-gray-400" size={24} />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 text-xs">✓</span>
                                </div>
                                <span className="text-lg font-medium text-gray-400">Email address verified</span>
                            </div>
                        </div>

                        {/* Phone Verified */}
                        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-sm text-gray-500">Required to publish a job</p>
                                <Smartphone className="text-gray-400" size={24} />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 text-xs">✓</span>
                                </div>
                                <span className="text-lg font-medium text-gray-400">Phone number verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overview Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-medium text-gray-900">Overview</h2>
                        <div className="flex bg-gray-100 rounded-full p-1">
                            <button className="p-2 bg-black text-white rounded-full shadow-sm">
                                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                    <div className="bg-current rounded-[1px]"></div>
                                    <div className="bg-current rounded-[1px]"></div>
                                    <div className="bg-current rounded-[1px]"></div>
                                    <div className="bg-current rounded-[1px]"></div>
                                </div>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full">
                                <div className="flex flex-col gap-0.5 w-4 h-4 justify-center">
                                    <div className="bg-current h-[2px] w-full rounded-full"></div>
                                    <div className="bg-current h-[2px] w-full rounded-full"></div>
                                    <div className="bg-current h-[2px] w-full rounded-full"></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="border border-gray-200 rounded-2xl p-12 flex items-center justify-center min-h-[300px]">
                            <p className="text-gray-600">Loading your jobs...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                            <div className="w-24 h-24 mb-6 relative">
                                {/* Briefcase Illustration */}
                                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-700">
                                    <path d="M20 35 H80 V80 H20 Z" fill="currentColor" rx="4" />
                                    <path d="M35 35 V25 Q35 15 50 15 Q65 15 65 25 V35" fill="none" stroke="currentColor" strokeWidth="6" />
                                    <rect x="46" y="45" width="8" height="12" fill="#fbbf24" rx="1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-6">
                                No job posts or contracts in progress right now
                            </h3>
                            <div className="flex gap-4">
                                <Link
                                    to="/jobs"
                                    className="px-6 py-2.5 border border-green-600 text-green-600 font-medium rounded-full hover:bg-green-50 transition-colors flex items-center"
                                >
                                    <Search size={18} className="mr-2" />
                                    Find a talent
                                </Link>
                                <Link
                                    to="/nx/job-post/chat"
                                    className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Post a job
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer bg-white"
                                    onClick={() => navigate(`/jobs/${job._id}`)}
                                >
                                    {/* Job Status Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${job.status === 'open' ? 'bg-green-100 text-green-700' :
                                            job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                job.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                                    job.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {job.status === 'in_progress' ? 'In Progress' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                        {job.proposals > 0 && (
                                            <span className="flex items-center text-sm text-gray-600">
                                                <Users size={16} className="mr-1" />
                                                {job.proposals} {job.proposals === 1 ? 'proposal' : 'proposals'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Job Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {job.title}
                                    </h3>

                                    {/* Job Description */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {job.description}
                                    </p>

                                    {/* Job Details */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center">
                                            <DollarSign size={16} className="mr-1" />
                                            <span className="font-medium">
                                                ${job.budget?.amount}
                                                {job.budget?.type === 'hourly' ? '/hr' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-1" />
                                            <span className="capitalize">{job.duration}</span>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.skills.slice(0, 3).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills.length > 3 && (
                                                <span className="text-xs px-2 py-1 text-gray-500">
                                                    +{job.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/proposals?job=${job._id}`);
                                            }}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                        >
                                            View Proposals
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/jobs/${job._id}/edit`);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Find Experts Section */}
                <div className="mb-12 relative group">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-medium text-gray-900">Find experts by category and book consultations</h2>
                        <Link to="/jobs" className="text-green-600 hover:text-green-700 font-medium flex items-center">
                            Browse consultations <ChevronRight size={20} />
                        </Link>
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={() => scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
                        className="absolute left-0 top-[60%] -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 text-gray-600 hover:text-green-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
                        className="absolute right-0 top-[60%] -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 text-gray-600 hover:text-green-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto pb-6 gap-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
                    >
                        {/* Guided Tour Card */}
                        <div className="min-w-[280px] w-[280px] h-[360px] flex-shrink-0 bg-emerald-900 rounded-xl p-6 text-white relative overflow-hidden group/card cursor-pointer flex flex-col justify-between">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-sm font-medium opacity-90">Guided tour</span>
                                    <button className="text-white opacity-70 hover:opacity-100">
                                        <X size={20} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-medium mb-4 leading-tight flex-grow">
                                    Book a consultation with an expert to review your project's budget, timeline, and scope one-on-one.
                                </h3>
                                <button className="bg-white text-emerald-900 px-4 py-2 rounded-lg font-medium text-sm w-max hover:bg-gray-100 transition-colors">
                                    Learn more
                                </button>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute bottom-4 right-4 opacity-20 group-hover/card:opacity-30 transition-opacity">
                                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" />
                                </svg>
                            </div>
                        </div>
                        {categories.map((cat, idx) => {
                            const IconComponent = iconMap[cat.icon];
                            return (
                                <div
                                    key={idx}
                                    onClick={() => navigate(`/nx/search/talent?offer_consultations=true&q=${encodeURIComponent(cat.query)}`)}
                                    className="min-w-[280px] w-[280px] h-[360px] flex-shrink-0 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-500 hover:border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center group/card bg-white"
                                >
                                    <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mb-6 text-white text-2xl group-hover/card:scale-110 transition-transform`}>
                                        {IconComponent ? <IconComponent size={32} /> : <div className="w-8 h-8 bg-white/20 rounded-md" />}
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900">{cat.name}</h3>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Help Resources */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-medium text-gray-900">Help and resources</h2>
                        <Link to="/help" className="text-green-600 hover:text-green-700 font-medium flex items-center">
                            View all resources <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Get Started Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                            <div className="max-w-xl z-10">
                                <p className="text-sm text-gray-500 mb-2">Get started</p>
                                <h3 className="text-3xl font-medium text-gray-900 mb-6">
                                    Get started and connect with talent to get work done
                                </h3>
                                <button className="px-6 py-2 border border-gray-300 rounded-full text-green-600 font-medium hover:bg-gray-50 transition-colors">
                                    Learn more
                                </button>
                            </div>
                            <div className="mt-8 md:mt-0 relative z-10">
                                {/* Rocket Illustration Placeholder */}
                                <div className="w-48 h-48 relative">
                                    <div className="absolute inset-0 bg-pink-100 rounded-full opacity-50 blur-2xl"></div>
                                    <svg viewBox="0 0 24 24" className="w-full h-full text-pink-500 transform -rotate-45" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="#fbcfe8" />
                                        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="#f472b6" />
                                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Payments Card 1 */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Payments</p>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Everything you need to know about payments
                                    </h3>
                                </div>
                                <div className="w-24 h-24 flex-shrink-0 relative">
                                    <div className="absolute inset-0 bg-green-100 rounded-full opacity-50 blur-xl"></div>
                                    <div className="relative z-10">
                                        <CreditCard className="w-16 h-16 text-green-500 transform -rotate-12" />
                                        <Lock className="w-8 h-8 text-amber-500 absolute -bottom-2 -right-2" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* Payments Card 2 */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Payments</p>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        How to set up your preferred billing method
                                    </h3>
                                </div>
                                <div className="w-24 h-24 flex-shrink-0 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
                                    <div className="relative z-10">
                                        <CreditCard className="w-16 h-16 text-purple-500" />
                                        <div className="w-12 h-8 bg-green-400 rounded absolute -bottom-2 -left-2 border-2 border-white"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust & Safety Card */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Trust & safety</p>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Keep yourself and others safe on FreelancerPro
                                    </h3>
                                </div>
                                <div className="w-24 h-24 flex-shrink-0 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-red-100 rounded-full opacity-50 blur-xl"></div>
                                    <div className="relative z-10 flex">
                                        <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
                                        <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white -ml-2"></div>
                                        <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white -ml-2"></div>
                                    </div>
                                    <div className="absolute bottom-0 right-0">
                                        <MapPin className="w-6 h-6 text-red-500" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main >
            <FreelancerProFooter className="mx-4 md:mx-8 mb-4 rounded-2xl" />
        </div >
    );
}
