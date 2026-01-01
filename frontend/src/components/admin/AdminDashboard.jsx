import { useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { Users, Briefcase, FileText, DollarSign, TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
    const { platformStats, loading, error, loadPlatformStats } = useAdminStore();

    useEffect(() => {
        loadPlatformStats();
    }, [loadPlatformStats]);

    // Use real data from backend or fallback to empty array
    const revenueData = platformStats?.revenueOverTime?.map(item => ({
        name: item._id,
        revenue: item.revenue
    })) || [];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 animate-pulse rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative">
                    <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                    <p className="mt-2 text-green-100">Welcome back! Here's what's happening with your platform today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            {platformStats && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Users"
                        value={platformStats.users?.total || 0}
                        icon={Users}
                        trend={`${platformStats.users?.growth > 0 ? '+' : ''}${platformStats.users?.growth || 0}%`}
                        trendUp={platformStats.users?.growth >= 0}
                        gradient="from-blue-500 to-blue-600"
                        lightGradient="from-blue-50 to-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        label="Active Jobs"
                        value={platformStats.jobs?.active || 0}
                        icon={Briefcase}
                        trend={`${platformStats.jobs?.growth > 0 ? '+' : ''}${platformStats.jobs?.growth || 0}%`}
                        trendUp={platformStats.jobs?.growth >= 0}
                        gradient="from-green-500 to-emerald-600"
                        lightGradient="from-green-50 to-emerald-100"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        label="Total Contracts"
                        value={platformStats.contracts?.total || 0}
                        icon={FileText}
                        trend={`${platformStats.contracts?.growth > 0 ? '+' : ''}${platformStats.contracts?.growth || 0}%`}
                        trendUp={platformStats.contracts?.growth >= 0}
                        gradient="from-purple-500 to-purple-600"
                        lightGradient="from-purple-50 to-purple-100"
                        iconColor="text-purple-600"
                    />
                    <StatCard
                        label="Total Revenue"
                        value={`$${platformStats.revenue?.total?.toLocaleString() ?? '0'}`}
                        icon={DollarSign}
                        trend={`${platformStats.revenue?.growth > 0 ? '+' : ''}${platformStats.revenue?.growth || 0}%`}
                        trendUp={platformStats.revenue?.growth >= 0}
                        gradient="from-amber-500 to-orange-600"
                        lightGradient="from-amber-50 to-orange-100"
                        iconColor="text-amber-600"
                    />
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Revenue Chart */}
                <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
                            <p className="mt-1 text-sm text-gray-500">Monthly revenue overview</p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 p-3">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="h-64 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={revenueData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    prefix="$"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                            <p className="mt-1 text-sm text-gray-500">Latest platform events</p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-3">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {(platformStats?.recentActivity || []).slice(0, 6).map((item, i) => (
                            <div key={i} className="group/item flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50">
                                <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${item.type === 'payment' ? 'bg-amber-500' :
                                    item.type === 'user_registration' ? 'bg-blue-500' :
                                        'bg-green-500'
                                    }`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">
                                        {item.action} <span className="font-semibold text-gray-900">{item.user}</span>
                                    </p>
                                    {item.details && (
                                        <p className="mt-1 text-xs text-gray-500">{item.details}</p>
                                    )}
                                </div>
                                <span className="flex-shrink-0 text-xs text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {(!platformStats?.recentActivity || platformStats.recentActivity.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Activity className="mb-3 h-12 w-12 text-gray-300" />
                                <p className="text-sm font-medium text-gray-500">No recent activity</p>
                                <p className="mt-1 text-xs text-gray-400">Activity will appear here as it happens</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Stats Row */}
            {platformStats && (
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Freelancers</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {platformStats.users?.freelancers || 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Clients</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {platformStats.users?.clients || 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {platformStats.jobs?.completed || 0}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Briefcase className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, trend, trendUp, gradient, lightGradient, iconColor }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${lightGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-600">{label}</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{value ?? '-'}</p>
                    </div>
                    <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    {trendUp ? (
                        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">{trend}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1">
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                            <span className="text-xs font-semibold text-red-600">{trend}</span>
                        </div>
                    )}
                    <span className="text-xs text-gray-500">vs last month</span>
                </div>
            </div>
        </div>
    );
}
