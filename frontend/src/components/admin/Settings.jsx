import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore.js';
import { Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
    const { updateSettings } = useAdminStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        platformName: 'Freelancer Marketplace',
        supportEmail: 'support@example.com',
        commission: 10,
        minWithdrawal: 50,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateSettings(formData);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Platform Name</label>
                            <input
                                type="text"
                                name="platformName"
                                value={formData.platformName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Support Email</label>
                            <input
                                type="email"
                                name="supportEmail"
                                value={formData.supportEmail}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Platform Commission (%)</label>
                            <input
                                type="number"
                                name="commission"
                                value={formData.commission}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Minimum Withdrawal Amount ($)</label>
                            <input
                                type="number"
                                name="minWithdrawal"
                                value={formData.minWithdrawal}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
