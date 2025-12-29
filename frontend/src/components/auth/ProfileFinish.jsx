import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompleteProfileModal from './CompleteProfileModal.jsx';

export default function ProfileFinish() {
    const navigate = useNavigate();
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

    const handleSubscribe = () => {
        // Show complete profile modal when subscribing
        setShowCompleteProfileModal(true);
    };

    const handleGetConnectsClick = () => {
        // Redirect to find-work best-matches page when clicking "Get 50 Connects free"
        navigate('/nx/find-work/best-matches');
    };

    const handleSkip = () => {
        // Skip subscription and go to dashboard
        navigate('/nx/find-work/best-matches');
    };

    return (
        <div className="min-h-screen bg-white">
            <CompleteProfileModal
                open={showCompleteProfileModal}
                onClose={() => setShowCompleteProfileModal(false)}
            />
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header Section - White background */}
                <div className="mb-8 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Your profile is ready! Now, you'll need Connects to bid on jobs.
                    </h1>
                    <p className="text-lg text-gray-700 mb-3">
                        Connects are virtual tokens you'll use to pursue jobs and start earning.
                    </p>
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                        Learn more
                    </a>
                </div>

                {/* Freelancer Plus Promotion Section - Dark gray background */}
                <div className="bg-gray-800 rounded-lg p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left side - Benefits */}
                        <div className="flex-1">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                                Get 100 monthly Connects and more with Freelancer Plus
                            </h2>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white text-lg">100 Connects per month</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white text-lg">Freelancer Chat Pro, a new AI app powered by OpenAI's GPT-4</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white text-lg">View competitor bids</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white text-lg">And more</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-white text-lg">Cancel anytime</span>
                                </li>
                            </ul>

                            <div>
                                <button
                                    onClick={handleSubscribe}
                                    className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors mb-2"
                                >
                                    Subscribe for $19.99/month
                                </button>
                                <button
                                    onClick={handleGetConnectsClick}
                                    className="text-white text-sm hover:text-green-300 underline cursor-pointer"
                                >
                                    Get 50 Connects free for a limited time
                                </button>
                            </div>
                        </div>

                        {/* Right side - Social Proof */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-gray-700 rounded-lg p-6 h-full">
                                <p className="text-white text-lg mb-4">
                                    Chosen by the best, 40% of subscribers are our top-rated talent.
                                </p>
                                <div className="flex -space-x-2">
                                    {/* Profile avatars - using placeholder colors */}
                                    <div className="w-12 h-12 rounded-full bg-blue-400 border-2 border-gray-700"></div>
                                    <div className="w-12 h-12 rounded-full bg-purple-400 border-2 border-gray-700"></div>
                                    <div className="w-12 h-12 rounded-full bg-pink-400 border-2 border-gray-700"></div>
                                    <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-gray-700"></div>
                                    <div className="w-12 h-12 rounded-full bg-green-400 border-2 border-gray-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skip option - outside the dark box */}
                <div className="text-center mt-8">
                    <button
                        onClick={handleSkip}
                        className="text-gray-600 hover:text-gray-800 font-medium underline"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}

