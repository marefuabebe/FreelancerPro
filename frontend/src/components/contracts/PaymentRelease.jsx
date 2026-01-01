import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useContractStore } from '../../store/useContractStore.js';
import toast from 'react-hot-toast';

export default function PaymentRelease({ contractId, milestoneId }) {
    const { releasePayment } = useContractStore();
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        if (!window.confirm('Are you sure you want to release payment for this milestone? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await releasePayment(contractId, milestoneId);
            toast.success('Payment released successfully!');
        } catch (error) {
            console.error('Error releasing payment:', error);
            toast.error('Failed to release payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Releasing...
                </>
            ) : (
                <>
                    <DollarSign className="w-4 h-4" />
                    Release Payment
                </>
            )}
        </button>
    );
}
