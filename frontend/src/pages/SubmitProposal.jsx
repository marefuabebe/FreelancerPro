import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore.js';
import { useProposalStore } from '../store/useProposalStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { ArrowLeft, DollarSign, Clock, Paperclip, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ProposalFileUpload from '../components/proposals/ProposalFileUpload.jsx';

export default function SubmitProposal() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { selectedJob, fetchJobById, loading: jobLoading } = useJobStore();
    const { create, loading: proposalLoading } = useProposalStore();
    const { user } = useAuthStore();

    const [coverLetter, setCoverLetter] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [duration, setDuration] = useState('less_than_1_month');
    const [attachments, setAttachments] = useState([]);
    const [files, setFiles] = useState([]);

    // Redirect clients away from this page
    useEffect(() => {
        if (user && user.role !== 'freelancer') {
            toast.error('Only freelancers can submit proposals');
            navigate('/jobs');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (jobId) {
            fetchJobById(jobId);
        }
    }, [jobId, fetchJobById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coverLetter || !bidAmount) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (coverLetter.length < 100) {
            toast.error('Cover letter must be at least 100 characters long');
            return;
        }

        // Map duration string to number and unit
        let durationValue = 1;
        let durationUnit = 'months';

        switch (duration) {
            case 'less_than_1_month': durationValue = 1; durationUnit = 'months'; break;
            case '1_to_3_months': durationValue = 2; durationUnit = 'months'; break;
            case '3_to_6_months': durationValue = 4; durationUnit = 'months'; break;
            case 'more_than_6_months': durationValue = 7; durationUnit = 'months'; break;
        }

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('jobId', jobId);
            formData.append('coverLetter', coverLetter);
            formData.append('proposedRate', JSON.stringify({
                amount: Number(bidAmount),
                type: selectedJob.budget?.type || 'fixed',
                currency: 'USD'
            }));
            formData.append('duration', durationValue);
            formData.append('durationUnit', durationUnit);

            // Append files
            files.forEach((file) => {
                formData.append('files', file);
            });

            console.log('📤 Submitting proposal with', files.length, 'file(s)');

            await create(formData);
            toast.success('Proposal submitted successfully!');
            navigate('/proposals');
        } catch (error) {
            console.error('Failed to submit proposal:', error);
            toast.error(error.response?.data?.message || 'Failed to submit proposal');
        }
    };

    if (jobLoading || !selectedJob) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Job Details
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h1 className="text-2xl font-bold text-gray-900">Submit a Proposal</h1>
                        <p className="text-gray-600 mt-1">for {selectedJob.title}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Bid Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Proposal Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Bid ({selectedJob.budget?.type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'})
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3 text-gray-900 bg-white"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">USD</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Client's budget: {selectedJob.budget?.type === 'hourly'
                                            ? `$${selectedJob.budget.amount}/hr`
                                            : `$${selectedJob.budget.amount}`}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estimated Duration
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 text-gray-900 bg-white"
                                        >
                                            <option value="less_than_1_month">Less than 1 month</option>
                                            <option value="1_to_3_months">1 to 3 months</option>
                                            <option value="3_to_6_months">3 to 6 months</option>
                                            <option value="more_than_6_months">More than 6 months</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Cover Letter</h2>
                            <p className="text-sm text-gray-500">
                                Introduce yourself and explain why you're the best candidate for this job.
                            </p>
                            <textarea
                                rows={8}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-4 text-gray-900 bg-white"
                                placeholder="Hi there, I read your job description and..."
                            />
                        </div>

                        {/* Attachments */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
                            <ProposalFileUpload
                                files={files}
                                onFilesChange={setFiles}
                                maxFiles={5}
                                maxSize={10 * 1024 * 1024}
                            />
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={proposalLoading}
                                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                            >
                                {proposalLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Proposal'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
