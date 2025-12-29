
import { useNavigate } from 'react-router-dom';

export default function ManualProfile() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4">Fill Out Manually</h1>
            <p className="mb-6 text-gray-600">This feature is coming soon.</p>
            <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
                Go Back
            </button>
        </div>
    );
}
