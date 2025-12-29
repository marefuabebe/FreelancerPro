import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateNumber } from '../../utils/validationUtils.js';
import toast from 'react-hot-toast';

export default function ProfileHourlyRate() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [rate, setRate] = useState(() => {
        const saved = localStorage.getItem('onboarding_hourly_rate');
        return saved ? Number(saved) : 0;
    });

    // FreelancerPro fee calculation: just for mockup, say 10%
    const fee = (rate * 0.1).toFixed(2);
    const gets = (rate * 0.9).toFixed(2);

    const handleRateChange = (v) => {
        // Allow only two decimals
        v = v.replace(/[^\d.]/g, '').replace(/(\..*?)\..*/g, '$1');
        setRate(v ? Number(v) : 0);
        setError('');
    };

    const handleNext = () => {
        // Validate hourly rate
        const validation = validateNumber(rate, 5, 999, 'Hourly rate');
        if (!validation.isValid) {
            setError(validation.error);
            toast.error(validation.error);
            return;
        }

        const normalized = Math.max(0, Math.min(999, Number(rate) || 0));
        localStorage.setItem('onboarding_hourly_rate', String(normalized));
        navigate('/nx/create-profile/location');
    };

    return (
        <div className="min-h-screen bg-white flex items-start justify-center p-10">
            <div className="w-full max-w-5xl">
                <div className="text-sm text-gray-600 mb-3">9/10</div>
                <div className="w-full h-1 bg-gray-200 rounded mb-10">
                    <div className="h-full bg-gray-400 rounded" style={{ width: '90%' }} />
                </div>

                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Now, let’s set your hourly rate.</h1>
                <p className="text-gray-700 mb-8">Clients will see this rate on your profile and in search results once you publish your profile. You can adjust your rate every time you submit a proposal.</p>

                <div className="mb-8">
                    <div className="font-bold text-2xl mb-2">Hourly rate</div>
                    <div className="text-gray-700 mb-3">Total amount the client will see.</div>
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="0"
                            max="999"
                            step="0.01"
                            value={rate || ''}
                            onChange={(e) => handleRateChange(e.target.value)}
                            className="w-56 text-right text-2xl border rounded-lg px-7 py-3 mr-3 text-gray-900 bg-white"
                            style={{ appearance: 'textfield' }}
                        />
                        <span className="text-2xl font-medium">/hr</span>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <p className="text-gray-500 text-xs mt-2">Minimum rate: $5/hr, Maximum: $999/hr</p>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="font-bold text-2xl">Service fee</div>
                        <a href="#" className="text-green-700 underline text-base">Learn more</a>
                    </div>
                    <div className="text-gray-700 mb-3 max-w-2xl">This helps us run the platform and provide services like payment protection and customer support. Fees vary and are shown before contract acceptance.</div>
                    <div className="flex items-center">
                        <input
                            value={rate ? `$${fee}` : '$0.00'}
                            disabled
                            className="w-56 text-right text-2xl border rounded-lg px-7 py-3 mr-3 bg-gray-100 text-gray-900"
                        />
                        <span className="text-2xl font-medium">/hr</span>
                    </div>
                </div>
                <div className="mb-10">
                    <div className="font-bold text-2xl mb-1">You'll get</div>
                    <div className="text-gray-700 mb-3">The estimated amount you'll receive after service fees</div>
                    <div className="flex items-center">
                        <input
                            value={rate ? `$${gets}` : '$0.00'}
                            disabled
                            className="w-56 text-right text-2xl border rounded-lg px-7 py-3 mr-3 bg-gray-100 text-gray-900"
                        />
                        <span className="text-2xl font-medium">/hr</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button type="button" onClick={() => navigate('/nx/create-profile/overview')} className="h-12 px-8 rounded-[28px] border border-gray-300 font-bold text-green-700 hover:bg-gray-50">Back</button>
                    <button type="button" onClick={handleNext} className="h-12 px-8 rounded-[28px] bg-green-600 hover:bg-green-700 text-white">Next, add your photo and location</button>
                </div>
            </div>
        </div>
    );
}
