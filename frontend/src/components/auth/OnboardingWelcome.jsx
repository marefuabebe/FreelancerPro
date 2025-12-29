import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useState } from 'react';
import TestimonialCarousel, { TESTIMONIALS } from '../common/TestimonialCarousel.jsx';

export default function OnboardingWelcome() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [index, setIndex] = useState(0);
    const t = TESTIMONIALS[index];
    const handleLeft = () => setIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    const handleRight = () => setIndex(i => (i + 1) % TESTIMONIALS.length);

    const handleGetStarted = () => {
        navigate('/nx/create-profile/experience-level')
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Left Side: Information */}
                <div className="space-y-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                        Hey {user?.firstName || 'Tewodros'}. Ready for your next big opportunity?
                    </h1>
                    <ul className="space-y-6">
                        <li className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <span className="ml-4 text-lg text-gray-700">Answer a few questions and start building your profile</span>
                        </li>
                        <li className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="ml-4 text-lg text-gray-700">Apply for open roles or list services for clients to buy</span>
                        </li>
                        <li className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <span className="ml-4 text-lg text-gray-700">Get paid safely and know we're there to help</span>
                        </li>
                    </ul>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Get started
                        </button>
                        <p className="text-sm text-gray-500 max-w-xs">
                            It only takes 5-10 minutes and you can edit it later. We'll save as you go.
                        </p>
                    </div>
                </div>
                {/* Right Side: Testimonial Carousel Card */}
                <TestimonialCarousel testimonials={TESTIMONIALS} />
            </div>
        </div>
    )
}