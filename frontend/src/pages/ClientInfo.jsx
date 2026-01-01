import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, User, Building2, MapPin, Clock, CreditCard, Lock, Users, Bell, FileText, Link as LinkIcon, AlertCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SecurityModal from '../components/common/SecurityModal';
import CompanyDetailsModal from '../components/common/CompanyDetailsModal';
import FreelancerProFooter from '../components/common/UpworkFooter.jsx';

export default function ClientInfo() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-info');
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

    const sidebarItems = [
        { id: 'my-info', label: 'My info', icon: User },
        { id: 'billing', label: 'Billing & Payments', icon: CreditCard, path: '/nx/payments/deposit-methods' },
        { id: 'security', label: 'Password & Security', icon: Lock },
        { id: 'teams', label: 'Teams & Members', icon: Users },
        { id: 'membership', label: 'Membership', icon: FileText },
        { id: 'notifications', label: 'Notification Settings', icon: Bell },
        { id: 'tax', label: 'Tax Information', icon: FileText },
        { id: 'connected', label: 'Connected Services', icon: LinkIcon },
        { id: 'appeals', label: 'Appeals Tracker', icon: AlertCircle },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
            <SecurityModal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} />
            <CompanyDetailsModal isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.path) {
                                                navigate(item.path);
                                                return;
                                            }
                                            setActiveTab(item.id);
                                            // If user wants clicking "Password & Security" to also open the modal:
                                            if (item.id === 'security') setIsSecurityModalOpen(true);
                                        }}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === item.id
                                            ? 'bg-transparent text-gray-900 dark:text-white border-l-4 border-gray-900 dark:border-white pl-2'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                            }`}
                                    >
                                        {/* <Icon size={18} className="mr-3" /> */}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'my-info' && (
                            <div className="space-y-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Info</h2>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">This is a client account</p>
                                </div>

                                {/* Account Section */}
                                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => setIsSecurityModalOpen(true)}
                                        >
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Account</h3>
                                        </div>
                                        <button
                                            onClick={() => setIsSecurityModalOpen(true)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full border border-green-600 dark:hover:bg-slate-800 transition-colors"
                                            title="Add extra layers of security"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white text-lg">{user?.firstName} {user?.lastName}</div>
                                            <div className="text-gray-500 dark:text-slate-400">Basic</div>
                                            <div className="text-gray-900 dark:text-white mt-1">Web D</div>

                                            <div className="mt-4">
                                                <div className="text-sm text-gray-500 dark:text-slate-400">Email</div>
                                                <div className="text-gray-900 dark:text-white">{user?.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Details */}
                                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => setIsCompanyModalOpen(true)}
                                        >
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Company details</h3>
                                        </div>
                                        <button
                                            onClick={() => setIsCompanyModalOpen(true)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full border border-green-600 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                                            <Building2 size={24} />
                                        </div>
                                        <div className="text-gray-900 dark:text-white">Web D</div>
                                    </div>
                                </div>

                                {/* Company Contacts */}
                                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company contacts</h3>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full border border-green-600 dark:hover:bg-slate-800 transition-colors">
                                            <Pencil size={18} />
                                        </button>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400">Owner</div>
                                        <div className="text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">VAT ID</div>
                                        <Link to="#" className="text-green-600 hover:underline text-sm font-medium">
                                            Enter your VAT ID to enable VAT invoicing
                                        </Link>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Time Zone</div>
                                        <div className="text-gray-900 dark:text-white">UTC (Coordinated Universal Time)</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Address</div>
                                        <div className="text-gray-900 dark:text-white">{user?.country || 'Ethiopia'}</div>
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">This is a client account</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                                            Create New Account
                                        </button>
                                        <button className="text-green-600 hover:bg-green-50 px-6 py-2 rounded-full font-medium transition-colors dark:hover:bg-slate-800">
                                            Close account
                                        </button>
                                        <button className="text-green-600 hover:bg-green-50 px-6 py-2 rounded-full font-medium transition-colors dark:hover:bg-slate-800">
                                            Transfer Ownership
                                        </button>
                                    </div>
                                </div>

                                {/* AI Preference */}
                                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI preference</h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                                        Choose how your FreelancerPro data is used for AI training and improvement. <Link to="#" className="text-green-600 hover:underline">Learn more</Link>
                                    </p>
                                    <button className="text-green-600 border border-green-600 hover:bg-green-50 px-6 py-2 rounded-full font-medium transition-colors dark:hover:bg-slate-800">
                                        Set preference
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FreelancerProFooter className="mx-4 sm:mx-6 lg:mx-8 rounded-xl mb-6" />
        </div>
    );
}
