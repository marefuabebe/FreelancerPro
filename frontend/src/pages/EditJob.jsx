import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/useJobStore.js';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedJob, fetchJobById, updateJob, loading: storeLoading } = useJobStore();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        skills: [],
        budgetType: 'fixed',
        budgetAmount: '',
        duration: 'medium',
        experienceLevel: 'intermediate'
    });

    useEffect(() => {
        if (id) fetchJobById(id);
    }, [id, fetchJobById]);

    useEffect(() => {
        if (selectedJob) {
            setFormData({
                title: selectedJob.title || '',
                description: selectedJob.description || '',
                category: selectedJob.category || '',
                skills: selectedJob.skills || [],
                budgetType: selectedJob.budget?.type || 'fixed',
                budgetAmount: selectedJob.budget?.amount || '',
                duration: selectedJob.duration || 'medium',
                experienceLevel: selectedJob.experienceLevel || 'intermediate'
            });
        }
    }, [selectedJob]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (e) => {
        const skillsString = e.target.value;
        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, skills: skillsArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                skills: formData.skills,
                budget: {
                    type: formData.budgetType,
                    amount: Number(formData.budgetAmount),
                    currency: 'USD'
                },
                duration: formData.duration,
                experienceLevel: formData.experienceLevel
            };

            await updateJob(id, payload);
            toast.success('Job updated successfully');
            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update job');
        } finally {
            setLoading(false);
        }
    };

    if (storeLoading || !selectedJob) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Job Details
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Job Post</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                            <input
                                type="text"
                                value={formData.skills.join(', ')}
                                onChange={handleSkillsChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                                placeholder="React, Node.js, Design"
                            />
                        </div>

                        {/* Budget */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Type</label>
                                <select
                                    name="budgetType"
                                    value={formData.budgetType}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                                >
                                    <option value="fixed">Fixed Price</option>
                                    <option value="hourly">Hourly Rate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    name="budgetAmount"
                                    value={formData.budgetAmount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                                />
                            </div>
                        </div>

                        {/* Duration & Experience */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                                >
                                    <option value="short">Short term</option>
                                    <option value="medium">Medium term</option>
                                    <option value="long">Long term</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border text-gray-900 bg-white"
                                >
                                    <option value="entry">Entry Level</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
