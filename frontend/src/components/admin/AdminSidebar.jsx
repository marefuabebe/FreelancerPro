import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    DollarSign,
    ShieldAlert,
    Settings,
    FileBarChart,
    LogOut,
    ChevronRight
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Proposals', href: '/admin/proposals', icon: FileText },
    { name: 'Contracts', href: '/admin/contracts', icon: FileText },
    { name: 'Financials', href: '/admin/financials', icon: DollarSign },
    { name: 'Disputes', href: '/admin/disputes', icon: ShieldAlert },
    { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex h-full w-64 flex-col bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white shadow-2xl">
            {/* Header */}
            <div className="relative overflow-hidden border-b border-green-600/30 bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                            <span className="text-xl font-bold">F</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-wide">FreelancerPro</h1>
                            <p className="text-xs text-green-100">Admin Panel</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-white text-green-700 shadow-lg scale-105'
                                    : 'text-green-100 hover:bg-green-700/50 hover:text-white hover:scale-105'
                                    }`}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-green-600"></div>
                                )}

                                <item.icon
                                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-green-700 scale-110' : 'text-green-300 group-hover:text-white group-hover:scale-110'
                                        }`}
                                />
                                <span className="flex-1">{item.name}</span>

                                {isActive && (
                                    <ChevronRight className="h-4 w-4 text-green-700" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile Section */}
            <div className="border-t border-green-600/30 p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-green-700/50 p-3 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-sm font-bold text-white shadow-lg">
                        {user?.firstName?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                        </p>
                        <p className="text-xs text-green-200 truncate">{user?.email || 'admin@freelancerpro.com'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-green-100 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
