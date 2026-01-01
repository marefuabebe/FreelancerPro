import React, { useState } from 'react';

const DisputeForm = ({ contractId, onCancel, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ reason, description });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">File a Dispute</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Reason</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        required
                    >
                        <option value="">Select a reason</option>
                        <option value="non_delivery">Non-delivery of work</option>
                        <option value="poor_quality">Poor quality of work</option>
                        <option value="communication">Communication issues</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Please describe the issue in detail..."
                        required
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Submit Dispute
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DisputeForm;
