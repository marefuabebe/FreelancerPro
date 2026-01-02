import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobManagement() {
    const { jobs, loading, error, fetchAdminJobs, updateJobStatus } = useAdminStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAdminJobs();
    }, [fetchAdminJobs]);

    const handleStatusChange = async (jobId, status) => {
        try {
            await updateJobStatus(jobId, status);
            toast.success(`Job ${status} successfully`);
            fetchAdminJobs();
        } catch (err) {
            toast.error('Failed to update job status');
        }
    };

    // Filter jobs based on selected filter
    const filteredJobs = filter === 'all'
        ? jobs
        : jobs.filter(job => job.status === filter);

    if (loading) return <div className="p-6">Loading jobs...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Jobs</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Job Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Budget</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <tr key={job._id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{job.description}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">{job.client?.firstName} {job.client?.lastName}</div>
                                        <div className="text-xs text-gray-500">{job.client?.email}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        ${job.budget?.min} - ${job.budget?.max}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${job.status === 'open' ? 'bg-green-100 text-green-800' :
                                            job.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {job.status !== 'open' && (
                                                <button
                                                    onClick={() => handleStatusChange(job._id, 'open')}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Approve/Open Job"
                                                >
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                            {job.status !== 'suspended' && (
                                                <button
                                                    onClick={() => handleStatusChange(job._id, 'suspended')}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Suspend Job"
                                                >
                                                    <XCircle className="h-5 w-5" />
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
                                        <Eye className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? '' : filter} jobs found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try changing the filter to see more jobs</p>
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
