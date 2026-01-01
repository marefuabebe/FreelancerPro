import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { FileText, User, DollarSign } from 'lucide-react';

export default function ContractManagement() {
    const { contracts, loading, error, fetchAdminContracts } = useAdminStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAdminContracts();
    }, [fetchAdminContracts]);

    // Filter contracts based on selected filter
    const filteredContracts = filter === 'all'
        ? contracts
        : contracts.filter(contract => contract.status === filter);

    if (loading) return <div className="p-6">Loading contracts...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contract Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {filteredContracts.length} of {contracts.length} contracts
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Contracts</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="disputed">Disputed</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contract</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Parties</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredContracts.length > 0 ? (
                            filteredContracts.map((contract) => (
                                <tr key={contract._id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <FileText className="mr-3 h-5 w-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                                                <div className="text-xs text-gray-500">{contract.contractType}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="w-16 font-medium text-gray-700">Client:</span>
                                                {contract.client?.firstName} {contract.client?.lastName}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="w-16 font-medium text-gray-700">Freelancer:</span>
                                                {contract.freelancer?.firstName} {contract.freelancer?.lastName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                        ${contract.amount?.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${contract.status === 'active' ? 'bg-green-100 text-green-800' :
                                            contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                contract.status === 'disputed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(contract.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <FileText className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? '' : filter} contracts found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try changing the filter to see more contracts</p>
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
