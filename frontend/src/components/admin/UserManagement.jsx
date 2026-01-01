import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { CheckCircle, XCircle, Shield, Ban, Users, UserPlus, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance.js';

import KYCReviewModal from './KYCReviewModal';

export default function UserManagement() {
    const { users, loading, error, fetchUsers, updateUserStatus } = useAdminStore();
    const [filter, setFilter] = useState('all');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showKYCModal, setShowKYCModal] = useState(false);
    const [selectedKYCUser, setSelectedKYCUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'freelancer'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleVerifyKYC = (userId) => {
        setSelectedKYCUser(userId);
        setShowKYCModal(true);
    };

    const handleKYCSuccess = () => {
        fetchUsers();
        // Toast is handled in the modal
    };

    const handleStatusChange = async (userId, status, isActive) => {
        try {
            await updateUserStatus(userId, { status, isActive });
            toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update user status');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenModal = () => {
        const role = filter === 'freelancer' ? 'freelancer' : 'client';
        setFormData(prev => ({
            ...prev,
            role: role
        }));
        setShowAddUserModal(true);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/auth/register', formData);
            const roleLabel = formData.role === 'freelancer' ? 'Freelancer' : 'Client';
            toast.success(`${roleLabel} created successfully!`);
            setShowAddUserModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'freelancer'
            });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = filter === 'all'
        ? users
        : users.filter(user => user.role === filter);

    if (loading) return <div className="p-6">Loading users...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    const getButtonText = () => {
        return filter === 'freelancer' ? 'Add Freelancer' : 'Add Client';
    };

    const getModalTitle = () => {
        return filter === 'freelancer' ? 'Add New Freelancer' : 'Add New Client';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {filteredUsers.length} of {users.length} users
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Users</option>
                        <option value="freelancer">Freelancers</option>
                        <option value="client">Clients</option>
                    </select>
                    {(filter === 'freelancer' || filter === 'client') && (
                        <button
                            onClick={handleOpenModal}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <UserPlus className="h-5 w-5 mr-2" />
                            {getButtonText()}
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">KYC</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                                                    {user.firstName?.[0] || 'U'}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {user.kycStatus === 'approved' || user.kycVerified === true ? (
                                            <span className="flex items-center text-green-600">
                                                <CheckCircle className="mr-1 h-4 w-4" /> Verified
                                            </span>
                                        ) : user.kycStatus === 'pending' ? (
                                            <span className="flex items-center text-orange-500 font-medium">
                                                <AlertTriangle className="mr-1 h-4 w-4" /> Pending
                                            </span>
                                        ) : user.kycStatus === 'rejected' ? (
                                            <span className="flex items-center text-red-600">
                                                <XCircle className="mr-1 h-4 w-4" /> Rejected
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-gray-400">
                                                <XCircle className="mr-1 h-4 w-4" /> Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {user.kycStatus !== 'approved' && user.kycVerified !== true && (
                                                <button
                                                    onClick={() => handleVerifyKYC(user._id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Verify KYC"
                                                >
                                                    <Shield className="h-5 w-5" />
                                                </button>
                                            )}
                                            {user.isActive ? (
                                                <button
                                                    onClick={() => handleStatusChange(user._id, 'suspended', false)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Suspend User"
                                                >
                                                    <Ban className="h-5 w-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusChange(user._id, 'active', true)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Activate User"
                                                >
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Users className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? 'users' : filter + 's'} found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try changing the filter to see more users</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddUserModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowAddUserModal(false)}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">{getModalTitle()}</h3>
                                    <button
                                        onClick={() => setShowAddUserModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitUser} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            minLength={8}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddUserModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Creating...' : `Create ${filter === 'freelancer' ? 'Freelancer' : 'Client'}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <KYCReviewModal
                isOpen={showKYCModal}
                onClose={() => {
                    setShowKYCModal(false);
                    setSelectedKYCUser(null);
                }}
                userId={selectedKYCUser}
                onSuccess={handleKYCSuccess}
            />
        </div>
    );
}
