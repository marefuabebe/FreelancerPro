import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, FileText, Download, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axiosInstance.js';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore.js';

export default function ProposalDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/proposals/${id}`);
                const proposalData = response.data.data || response.data;
                console.log('📋 Proposal data received:', proposalData);
                console.log('📎 Attachments:', proposalData.attachments);
                console.log('📎 Attachments length:', proposalData.attachments?.length);
                setProposal(proposalData);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load proposal');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProposal();
        }
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus} this proposal?`)) {
            return;
        }

        try {
            setUpdating(true);
            await api.patch(`/proposals/${id}`, { status: newStatus });
            setProposal({ ...proposal, status: newStatus });
            alert(`Proposal ${newStatus} successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${newStatus} proposal`);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-green-600 hover:text-green-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!proposal) return null;

    const isClient = user?.role === 'client';
    const canTakeAction = isClient && proposal.status === 'pending';

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle className="w-5 h-5" />;
            case 'rejected': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        Proposal for: {proposal.job?.title || 'Job'}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Submitted {formatDistanceToNow(new Date(proposal.createdAt))} ago
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(proposal.status)}`}>
                                    {getStatusIcon(proposal.status)}
                                    <span className="font-medium capitalize">{proposal.status}</span>
                                </div>
                            </div>

                            {/* Freelancer Info */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                                {proposal.freelancer?.avatar ? (
                                    <img
                                        src={proposal.freelancer.avatar}
                                        alt={`${proposal.freelancer.firstName} ${proposal.freelancer.lastName}`}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                                        {proposal.freelancer?.firstName?.[0]}{proposal.freelancer?.lastName?.[0]}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {proposal.freelancer?.firstName} {proposal.freelancer?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">{proposal.freelancer?.title || 'Freelancer'}</p>
                                    {isClient && (
                                        <Link
                                            to={`/freelancers/${proposal.freelancer?._id}`}
                                            className="text-sm text-green-600 hover:text-green-700 mt-1 inline-block"
                                        >
                                            View Full Profile →
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap">{proposal.coverLetter}</p>
                                </div>
                            </div>

                            {/* Attachments */}
                            {proposal.attachments && proposal.attachments.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                                    <div className="space-y-2">
                                        {proposal.attachments.map((file, index) => (
                                            <a
                                                key={index}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <FileText className="w-5 h-5 text-gray-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {file.originalName || file.name || `Attachment ${index + 1}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'File'}
                                                    </p>
                                                </div>
                                                <Download className="w-5 h-5 text-gray-400" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Proposal Details Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-6 h-6 text-gray-700" />
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            ${proposal.proposedRate?.amount || proposal.proposedRate || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {proposal.proposedRate?.type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-gray-700" />
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {proposal.duration} {proposal.durationUnit || 'months'}
                                        </p>
                                        <p className="text-sm text-gray-500">Estimated Duration</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        {canTakeAction && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleStatusUpdate('accepted')}
                                        disabled={updating}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Accept Proposal
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('rejected')}
                                        disabled={updating}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Reject Proposal
                                    </button>
                                    <button
                                        onClick={() => navigate(`/chat?user=${proposal.freelancer?._id}`)}
                                        className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Message Freelancer
                                    </button>
                                </div>
                            </div>
                        )}

                        {!canTakeAction && isClient && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <button
                                    onClick={() => navigate(`/chat?user=${proposal.freelancer?._id}`)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Message Freelancer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
