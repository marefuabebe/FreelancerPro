import { useEffect, useState } from 'react'
import { useAdminStore } from '../../store/useAdminStore'
import { Search, Filter, Eye, FileText, DollarSign, Calendar } from 'lucide-react'

export default function ProposalManagement() {
    const { proposals, loading, fetchProposals } = useAdminStore()
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        console.log('🔄 Fetching proposals...')
        fetchProposals()
    }, [fetchProposals])

    // Ensure proposals is always an array
    const proposalsArray = Array.isArray(proposals) ? proposals : []

    console.log('📋 Proposals in component:', proposalsArray)
    console.log('📋 Proposals length:', proposalsArray.length)

    // Filter proposals based on selected filter
    const filteredProposals = filter === 'all'
        ? proposalsArray
        : proposalsArray.filter(proposal => proposal.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800'
            case 'rejected': return 'bg-red-100 text-red-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'withdrawn': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Proposal Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {filteredProposals.length} of {proposalsArray.length} proposals
                    </p>
                </div>
                <div className="flex space-x-3">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Proposals</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job / Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freelancer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover Letter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-3 text-gray-500">Loading proposals...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProposals.length > 0 ? (
                                filteredProposals.map((proposal) => (
                                    <tr key={proposal.id || proposal._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{proposal.job?.title || 'Unknown Job'}</div>
                                            <div className="text-sm text-gray-500">{proposal.job?.client?.firstName} {proposal.job?.client?.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">
                                                    {proposal.freelancer?.firstName?.[0] || 'F'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {proposal.freelancer?.firstName} {proposal.freelancer?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{proposal.freelancer?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                                {proposal.bidAmount || proposal.proposedRate?.amount || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 max-w-xs truncate" title={proposal.coverLetter}>
                                                {proposal.coverLetter || 'No cover letter'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                                                {proposal.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                {new Date(proposal.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                                <Eye className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? '' : filter} proposals found</p>
                                            <p className="text-xs text-gray-400 mt-1">Try changing the filter to see more proposals</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
