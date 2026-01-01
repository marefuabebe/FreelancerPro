import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

export default function SecurityModal({ isOpen, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: '',
        understandLock: false,
        keepLoggedIn: false
    });

    if (!isOpen) return null;

    const securityQuestions = [
        "Your favorite writer",
        "Your mother's maiden name",
        "Name of your first pet",
        "City where you were born"
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-0 flex-shrink-0">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add extra layers of security</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    <p className="text-gray-600 dark:text-slate-300">
                        You'll be prompted to enter your unique password and security answer when we need to verify your identity. So be sure to choose a password and answer that only you will know.
                    </p>

                    <a href="#" className="text-green-600 hover:underline text-sm font-medium inline-block">
                        Tips for creating a stronger password
                    </a>

                    {/* Password Fields */}
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">New password</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="show-password"
                                        checked={showPassword}
                                        onChange={(e) => setShowPassword(e.target.checked)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor="show-password" className="text-sm text-gray-600 dark:text-slate-400 cursor-pointer">Show password</label>
                                </div>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Security Question */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Select Security Question</label>
                            <div className="relative">
                                <select
                                    value={formData.securityQuestion}
                                    onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                >
                                    <option value="" disabled>Select a question</option>
                                    {securityQuestions.map((q, i) => (
                                        <option key={i} value={q}>{q}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Answer</label>
                            <input
                                type="text"
                                value={formData.securityAnswer}
                                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="understand-lock"
                                checked={formData.understandLock}
                                onChange={(e) => setFormData({ ...formData, understandLock: e.target.checked })}
                                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="understand-lock" className="text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
                                I understand my account will be locked if I am unable to answer this question
                            </label>
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="keep-logged-in"
                                checked={formData.keepLoggedIn}
                                onChange={(e) => setFormData({ ...formData, keepLoggedIn: e.target.checked })}
                                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="keep-logged-in" className="text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
                                Keep me logged in on this device
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-green-600 font-medium hover:bg-green-50 rounded-full transition-colors dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            // Handle save logic here
                            onClose();
                        }}
                        className="px-8 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors shadow-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
