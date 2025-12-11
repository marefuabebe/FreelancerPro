import { useEffect, useState } from 'react';
import { useProposalStore } from '../store/useProposalStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatDistanceToNow } from 'date-fns';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, Loader, MessageCircle, DollarSign, Calendar, User, Briefcase } from 'lucide-react';

export default function Proposals() {
  const { proposals, fetchProposals, update, loading, error } = useProposalStore();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('job');
  const [updatingId, setUpdatingId] = useState(null);

  const handleMessage = (proposal) => {
    const recipientId = user?.role === 'client'
      ? proposal.freelancer?._id || proposal.freelancer
      : proposal.job?.client?._id || proposal.job?.client;

    if (recipientId) {
      navigate(`/messages?user=${recipientId}&proposal=${proposal._id || proposal.id}`);
    }
  };

  useEffect(() => {
    const params = jobId ? { job: jobId } : {};
    fetchProposals(params);
  }, [fetchProposals, jobId]);

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
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'withdrawn': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleAccept = async (proposalId) => {
    if (window.confirm('Are you sure you want to accept this proposal?')) {
      try {
        setUpdatingId(proposalId);
        await update(proposalId, { status: 'accepted' });
        alert('Proposal accepted successfully!');
      } catch (error) {
        console.error('Error accepting proposal:', error);
        alert('Failed to accept proposal. Please try again.');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleReject = async (proposalId) => {
    if (window.confirm('Are you sure you want to reject this proposal?')) {
      try {
        setUpdatingId(proposalId);
        await update(proposalId, { status: 'rejected' });
        alert('Proposal rejected successfully!');
      } catch (error) {
        console.error('Error rejecting proposal:', error);
        alert('Failed to reject proposal. Please try again.');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  if (loading && proposals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {jobId ? 'Job Proposals' : 'My Proposals'}
              </h1>
              <p className="text-green-100">
                {jobId && proposals.length > 0
                  ? `Showing proposals for: ${proposals[0]?.job?.title || 'this job'}`
                  : user?.role === 'freelancer'
                    ? 'Track your submitted proposals and their status'
                    : 'Review proposals from talented freelancers'}
              </p>
            </div>
            {user?.role === 'freelancer' && (
              <Link
                to="/nx/find-work/best-matches"
                className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors shadow-md"
              >
                <Briefcase className="w-5 h-5" />
                Find Work
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {proposals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-500 mb-6">
              {user?.role === 'freelancer'
                ? "You haven't submitted any proposals yet. Start looking for work!"
                : "You haven't received any proposals yet."}
            </p>
            {user?.role === 'freelancer' && (
              <Link
                to="/nx/find-work/best-matches"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                Browse Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <div key={proposal._id || proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {proposal.job?.title || 'Unknown Job'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {user?.role === 'client'
                          ? `${proposal.freelancer?.firstName} ${proposal.freelancer?.lastName}`
                          : `${proposal.job?.client?.firstName || 'Unknown'}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDistanceToNow(new Date(proposal.createdAt))} ago
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bid Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${proposal.proposedRate?.amount || proposal.proposedRate || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        {proposal.proposedRate?.type === 'hourly' ? 'Per Hour' : 'Fixed Price'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-lg font-bold text-gray-900">
                        {proposal.duration} {proposal.durationUnit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Attachments</p>
                      <p className="text-lg font-bold text-gray-900">
                        {proposal.attachments?.length || 0} files
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Link
                    to={user?.role === 'client'
                      ? `/proposals/${proposal._id || proposal.id}`
                      : `/freelancers/${proposal.job?.client?._id || proposal.job?.client}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Details
                  </Link>

                  <button
                    onClick={() => handleMessage(proposal)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>

                  {user?.role === 'client' && proposal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(proposal._id || proposal.id)}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        disabled={updatingId === (proposal._id || proposal.id)}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(proposal._id || proposal.id)}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                        disabled={updatingId === (proposal._id || proposal.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
