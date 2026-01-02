import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function FinancialManagement() {
    const { transactions, loading, error, fetchAdminTransactions } = useAdminStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAdminTransactions();
    }, [fetchAdminTransactions]);

    // Filter transactions based on selected filter
    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(tx => tx.type === filter);

    if (loading) return <div className="p-6">Loading transactions...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Transactions</option>
                        <option value="payment">Payments</option>
                        <option value="payout">Payouts</option>
                        <option value="refund">Refunds</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Transaction</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">From / To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`mr-3 rounded-full p-2 ${tx.type === 'payment' ? 'bg-green-100 text-green-600' :
                                                tx.type === 'payout' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 capitalize">{tx.type.replace('_', ' ')}</div>
                                                <div className="text-xs text-gray-500">{tx.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {tx.from && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <ArrowUpRight className="mr-1 h-3 w-3 text-red-500" />
                                                    {tx.from.firstName} {tx.from.lastName}
                                                </div>
                                            )}
                                            {tx.to && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <ArrowDownLeft className="mr-1 h-3 w-3 text-green-500" />
                                                    {tx.to.firstName} {tx.to.lastName}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        ${tx.amount?.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <DollarSign className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? '' : filter} transactions found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try changing the filter to see more transactions</p>
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
