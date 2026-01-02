import { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, FileText, Calendar, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getKYCDocuments, getKYCHistory, approveKYC, rejectKYC } from '../../api/adminApi.js';
import toast from 'react-hot-toast';

const REJECTION_REASONS = [
    { value: 'invalid_document', label: 'Invalid Document' },
    { value: 'expired_document', label: 'Expired Document' },
    { value: 'poor_quality', label: 'Poor Quality / Unreadable' },
    { value: 'information_mismatch', label: 'Information Mismatch' },
    { value: 'incomplete_documents', label: 'Incomplete Documents' },
    { value: 'fraudulent', label: 'Suspected Fraudulent Document' },
    { value: 'other', label: 'Other (specify in notes)' },
];

export default function KYCReviewModal({ isOpen, onClose, userId, onSuccess }) {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [notes, setNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            fetchKYCData();
        }
    }, [isOpen, userId]);

    const fetchKYCData = async () => {
        setLoading(true);
        try {
            const [docsResponse, historyResponse] = await Promise.all([
                getKYCDocuments(userId),
                getKYCHistory(userId)
            ]);

            const docsData = docsResponse.data.data || docsResponse.data;
            const historyData = historyResponse.data.data || historyResponse.data;

            setUserData(docsData.user);
            setDocuments(docsData.documents || []);
            setHistory(historyData.history || []);
        } catch (error) {
            console.error('Error fetching KYC data:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load KYC data';
            toast.error(errorMessage);
            setLoading(false); // Make sure loading is set to false even on error
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this KYC verification?')) {
            return;
        }

        setIsApproving(true);
        try {
            await approveKYC(userId, { notes: notes || 'KYC documents verified successfully' });
            toast.success('KYC approved successfully');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error approving KYC:', error);
            toast.error(error.response?.data?.message || 'Failed to approve KYC');
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            toast.error('Please select a rejection reason');
            return;
        }

        if (!notes || notes.length < 10) {
            toast.error('Please provide detailed notes (minimum 10 characters)');
            return;
        }

        if (!window.confirm('Are you sure you want to reject this KYC verification? The user will be notified.')) {
            return;
        }

        setIsRejecting(true);
        try {
            await rejectKYC(userId, { reason: rejectionReason, notes });
            toast.success('KYC rejected successfully');
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error rejecting KYC:', error);
            toast.error(error.response?.data?.message || 'Failed to reject KYC');
        } finally {
            setIsRejecting(false);
        }
    };

    const handleDownload = (doc) => {
        if (doc.frontImage?.url) {
            window.open(doc.frontImage.url, '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">KYC Verification Review</h2>
                        <p className="mt-1 text-sm text-green-100">Review and verify user documents</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading KYC data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid max-h-[calc(90vh-80px)] grid-cols-3 gap-6 overflow-y-auto p-6">
                        {/* Left Sidebar - User Info & History */}
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <User className="h-5 w-5 text-green-600" />
                                    User Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-2xl font-bold text-white">
                                        {userData?.firstName?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-semibold text-gray-900">{userData?.firstName} {userData?.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{userData?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-800">
                                            {userData?.role}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Joined</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification History */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    Verification History
                                </h3>
                                <div className="space-y-4">
                                    {history.length > 0 ? (
                                        history.map((item, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.action === 'approved' ? 'bg-green-100' :
                                                        item.action === 'rejected' ? 'bg-red-100' :
                                                            item.action === 'in_review' ? 'bg-blue-100' :
                                                                'bg-gray-100'
                                                        }`}>
                                                        {item.action === 'approved' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                                                            item.action === 'rejected' ? <XCircle className="h-4 w-4 text-red-600" /> :
                                                                item.action === 'in_review' ? <AlertTriangle className="h-4 w-4 text-blue-600" /> :
                                                                    <FileText className="h-4 w-4 text-gray-600" />}
                                                    </div>
                                                    {index < history.length - 1 && (
                                                        <div className="h-full w-0.5 bg-gray-200"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="text-sm font-semibold capitalize text-gray-900">{item.action.replace('_', ' ')}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                                                    </p>
                                                    {item.performedBy && (
                                                        <p className="text-xs text-gray-600">by {item.performedBy.firstName} {item.performedBy.lastName}</p>
                                                    )}
                                                    {item.notes && (
                                                        <p className="mt-1 text-xs text-gray-700">{item.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No history available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Document Viewer */}
                        <div className="col-span-2 space-y-6">
                            {/* Document Viewer */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Document Viewer</h3>

                                {documents.length > 0 ? (
                                    <>
                                        {/* Main Document Display */}
                                        <div className="mb-4 overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                                            <div className="flex h-96 items-center justify-center p-4">
                                                {documents[selectedDocument]?.frontImage?.url ? (
                                                    <img
                                                        src={documents[selectedDocument].frontImage.url}
                                                        alt="KYC Document"
                                                        className="max-h-full max-w-full object-contain transition-transform"
                                                        style={{ transform: `scale(${zoom})` }}
                                                    />
                                                ) : (
                                                    <div className="text-center text-gray-500">
                                                        <FileText className="mx-auto mb-2 h-12 w-12" />
                                                        <p>No document image available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Zoom Controls */}
                                        <div className="mb-4 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                                                className="rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                                            >
                                                <ZoomOut className="h-5 w-5" />
                                            </button>
                                            <span className="min-w-[60px] text-center text-sm font-medium">{Math.round(zoom * 100)}%</span>
                                            <button
                                                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                                                className="rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                                            >
                                                <ZoomIn className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(documents[selectedDocument])}
                                                className="rounded-lg bg-green-600 p-2 text-white transition-colors hover:bg-green-700"
                                            >
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Document Thumbnails */}
                                        <div className="flex gap-2 overflow-x-auto">
                                            {documents.map((doc, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedDocument(index);
                                                        setZoom(1);
                                                    }}
                                                    className={`flex-shrink-0 rounded-lg border-2 p-2 transition-all ${selectedDocument === index
                                                        ? 'border-green-600 bg-green-50'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="h-20 w-20">
                                                        {doc.frontImage?.url ? (
                                                            <img
                                                                src={doc.frontImage.url}
                                                                alt={`Document ${index + 1}`}
                                                                className="h-full w-full rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                                <FileText className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs capitalize text-gray-600">{doc.type?.replace('_', ' ')}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-96 items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <FileText className="mx-auto mb-3 h-16 w-16 text-gray-300" />
                                            <p className="font-medium">No documents uploaded</p>
                                            <p className="text-sm">User hasn't submitted KYC documents yet</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Admin Notes */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Admin Notes</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add your review comments here..."
                                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                    rows={4}
                                />
                            </div>

                            {/* Rejection Reason */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Rejection Reason (if rejecting)</h3>
                                <select
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                >
                                    <option value="">Select a reason...</option>
                                    {REJECTION_REASONS.map((reason) => (
                                        <option key={reason.value} value={reason.value}>
                                            {reason.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={isRejecting || isApproving}
                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50"
                                >
                                    {isRejecting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Rejecting...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5" />
                                            Reject
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving || isRejecting}
                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50"
                                >
                                    {isApproving ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Approving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5" />
                                            Approve
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
