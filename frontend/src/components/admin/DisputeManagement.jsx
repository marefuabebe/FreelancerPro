import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { ShieldAlert, MessageSquare } from 'lucide-react';

export default function DisputeManagement() {
    const { disputes, loading, error, fetchAdminDisputes } = useAdminStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAdminDisputes();
    }, [fetchAdminDisputes]);

    // Filter disputes based on selected filter
    const filteredDisputes = filter === 'all'
        ? disputes
        : disputes.filter(dispute => dispute.status === filter);

    if (loading) return <div className="p-6">Loading disputes...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dispute Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {filteredDisputes.length} of {disputes.length} disputes
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Disputes</option>
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Dispute</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contract</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Parties</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredDisputes.length > 0 ? (
                            filteredDisputes.map((dispute) => (
                                <tr key={dispute._id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <ShieldAlert className="mr-3 h-5 w-5 text-red-500" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{dispute.reason}</div>
                                                <div className="text-xs text-gray-500">ID: {dispute._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {dispute.contract?.title || 'Unknown Contract'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-500">
                                                <span className="font-medium">Initiator:</span> {dispute.initiator?.firstName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <span className="font-medium">Respondent:</span> {dispute.respondent?.firstName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${dispute.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {dispute.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <ShieldAlert className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? '' : filter} disputes found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try changing the filter to see more disputes</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
