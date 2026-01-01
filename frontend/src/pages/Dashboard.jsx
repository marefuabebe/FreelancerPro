
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { Briefcase, DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuthStore();
    const { profile } = useUserStore();
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Mock data if initial fetch fails or while developing, but try API first
            try {
                // Assuming api is imported from axiosInstance
                const { default: api } = await import('../api/axiosInstance.js');
                const response = await api.get('/analytics/platform');
                if (response.data.success) {
                    setStats(response.data.data);
                    setRecentActivity(response.data.data.recentActivity || []);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'job_posted': return <Briefcase className="w-5 h-5 text-purple-600" />;
            case 'contract': return <FileText className="w-5 h-5 text-blue-600" />;
            case 'transaction': return <DollarSign className="w-5 h-5 text-green-600" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'User'}!</h2>
                <p className="text-green-50 text-lg opacity-90">
                    Here's what's happening with your projects today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stats?.jobs?.active || stats?.contracts?.active || 0}
                    </div>
                    <div className="text-sm text-gray-500">Active Jobs</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatCurrency(stats?.earnings?.total || stats?.spending?.total || 0)}
                    </div>
                    <div className="text-sm text-gray-500">{user?.role === 'client' ? 'Total Spent' : 'Total Earnings'}</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">All Time</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {user?.role === 'freelancer' ? (stats?.proposals?.submitted || 0) : (stats?.jobs?.posted || 0)}
                    </div>
                    <div className="text-sm text-gray-500">{user?.role === 'freelancer' ? 'Proposals Submitted' : 'Jobs Posted'}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                        {recentActivity.length > 0 ? (
                            <div className="space-y-6">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-semibold text-gray-900 truncate pr-4">
                                                    {activity.action}
                                                </p>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 truncate">
                                                {activity.details}
                                            </p>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                                    ${activity.type === 'job_posted' ? 'bg-purple-100 text-purple-800' :
                                                        activity.type === 'transaction' ? 'bg-green-100 text-green-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    } `}>
                                                    {activity.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <Clock className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900">No recent activity</h3>
                                <p className="text-sm text-gray-500 mt-1">Acitvity will appear here once you start using the platform.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recommended Jobs / Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Recommended For You</h3>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="p-4 bg-green-50 rounded-full mb-4">
                            <Briefcase className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Recommended Jobs</h3>
                        <p className="text-gray-500 max-w-xs mt-2">
                            Based on your skills and profile, we'll suggest jobs that are a perfect match for you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

