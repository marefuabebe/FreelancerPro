import { useEffect, useState } from 'react';
import { useContractStore } from '../store/useContractStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import MilestoneForm from '../components/contracts/MilestoneForm.jsx';
import PaymentRelease from '../components/contracts/PaymentRelease.jsx';
import DisputeForm from '../components/contracts/DisputeForm.jsx';
import Modal from '../components/common/Modal.jsx';
import { Briefcase, DollarSign, CheckCircle, Clock, AlertCircle, Plus, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contracts() {
    const { contracts, loading, error, fetchContracts } = useContractStore();
    const { user } = useAuthStore();
    const [openMilestoneFor, setOpenMilestoneFor] = useState(null);

    useEffect(() => { fetchContracts() }, [fetchContracts]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
                            <h1 className="text-3xl font-bold mb-2">Contracts</h1>
                            <p className="text-green-100">Manage your contracts, milestones, and payments</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-semibold">{contracts.length} Active</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {contracts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts yet</h3>
                        <p className="text-gray-500 mb-6">
                            Contracts are created when you accept a proposal from a freelancer.
                        </p>
                        <Link
                            to="/proposals"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
                        >
                            <Briefcase className="w-5 h-5" />
                            View Proposals
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {contracts.map((c) => {
                            const totalMilestones = c.milestones?.length || 0;
                            const completedMilestones = c.milestones?.filter(m => m.paid)?.length || 0;
                            const totalAmount = c.milestones?.reduce((sum, m) => sum + (m.amount || 0), 0) || 0;
                            const paidAmount = c.milestones?.filter(m => m.paid).reduce((sum, m) => sum + (m.amount || 0), 0) || 0;
                            const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

                            return (
                                <div key={c.id || c._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
                                    {/* Contract Header */}
                                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">{c.title || c.jobTitle || 'Contract'}</h3>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(c.status)}`}>
                                                {c.status || 'active'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {c.client && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <User className="w-4 h-4" />
                                                    <span>Client: {c.client.firstName || c.client.name || c.client.email}</span>
                                                </div>
                                            )}
                                            {c.freelancer && (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <User className="w-4 h-4" />
                                                    <span>Freelancer: {c.freelancer.firstName || c.freelancer.name || c.freelancer.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                            <span className="text-sm font-bold text-green-600">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                            <span>{completedMilestones} of {totalMilestones} milestones completed</span>
                                            <span>${paidAmount.toFixed(2)} / ${totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Milestones */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                Milestones
                                            </h4>
                                            <button
                                                onClick={() => setOpenMilestoneFor(c.id || c._id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add
                                            </button>
                                        </div>

                                        {(c.milestones || []).length === 0 ? (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">No milestones yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {c.milestones.map((m) => (
                                                    <div key={m.id || m._id} className={`p-4 rounded-lg border-2 ${m.paid ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {m.paid ? (
                                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                                    ) : (
                                                                        <Clock className="w-5 h-5 text-gray-400" />
                                                                    )}
                                                                    <h5 className="font-semibold text-gray-900">{m.title}</h5>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm text-gray-600 ml-7">
                                                                    <span className="flex items-center gap-1">
                                                                        <DollarSign className="w-4 h-4" />
                                                                        <span className="font-bold text-green-600">${m.amount}</span>
                                                                    </span>
                                                                    {m.dueDate && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar className="w-4 h-4" />
                                                                            {new Date(m.dueDate).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                    {m.paid && (
                                                                        <span className="text-green-600 font-medium">✓ Paid</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {!m.paid && (
                                                                <PaymentRelease contractId={c.id || c._id} milestoneId={m.id || m._id} />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Dispute Section */}
                                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-orange-600" />
                                            Dispute Resolution
                                        </h4>
                                        <DisputeForm contractId={c.id || c._id} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal open={!!openMilestoneFor} title="Add Milestone" onClose={() => setOpenMilestoneFor(null)}>
                <MilestoneForm onSubmit={async (payload) => {
                    await useContractStore.getState().createMilestone(openMilestoneFor, payload);
                    setOpenMilestoneFor(null);
                }} />
            </Modal>
        </div>
    );
}
