import { useState } from 'react';
import { X, Building2, AlertCircle } from 'lucide-react';

export default function CompanyDetailsModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        companyName: 'Web D',
        website: '',
        industry: '',
        companySize: '',
        tagline: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const industries = [
        "Software & Technology",
        "Marketing & Advertising",
        "Financial Services",
        "Education",
        "Healthcare",
        "Other"
    ];

    const companySizes = [
        "It's just me",
        "2-9 employees",
        "10-99 employees",
        "100-1,000 employees",
        "More than 1,000 employees"
    ];

    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.industry) {
            newErrors.industry = 'This field is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Handle save
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-0 flex-shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Company details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Column - Logo Placeholder */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                                <Building2 size={32} />
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="flex-1 space-y-6">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Company Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                    {formData.companyName && (
                                        <button
                                            onClick={() => setFormData({ ...formData, companyName: '' })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Website</label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Add your industry</label>
                                <div className="relative">
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => {
                                            setFormData({ ...formData, industry: e.target.value });
                                            if (errors.industry) setErrors({ ...errors, industry: null });
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-gray-900 dark:bg-slate-800 dark:text-white ${errors.industry ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                                    >
                                        <option value="" disabled>Select your industry</option>
                                        {industries.map((ind, i) => (
                                            <option key={i} value={ind}>{ind}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors.industry && (
                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.industry}</span>
                                    </div>
                                )}
                            </div>

                            {/* Company Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">How many people are in your company?</label>
                                <div className="space-y-3">
                                    {companySizes.map((size, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="companySize"
                                                value={size}
                                                checked={formData.companySize === size}
                                                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                                                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                            />
                                            <span className="text-gray-700 dark:text-slate-300">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Tagline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 text-green-600 font-medium hover:bg-green-50 rounded-full transition-colors dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
