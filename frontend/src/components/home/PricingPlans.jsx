import { Link } from 'react-router-dom'

export default function PricingPlans() {
    return (
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-50 rounded-3xl overflow-hidden p-8 md:p-16">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        Clients only pay after hiring
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Basic Plan */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                            <p className="text-gray-500 mb-6">For starting out</p>

                            <div className="text-lg font-medium text-gray-900 mb-8">
                                5% Service fee after hiring
                            </div>

                            <p className="text-gray-600 mb-6">Basic plan includes:</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-600">AI-powered features</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-600">Collaboration and project tracking tools</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-600">Pay as work is completed</span>
                                </li>
                            </ul>

                            <Link
                                to="/signup"
                                className="block w-full text-center border-2 border-green-600 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors"
                            >
                                Get started for free
                            </Link>
                        </div>

                        {/* Business Plus Plan */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-5 right-5 bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                POPULAR
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Plus</h3>
                            <p className="text-gray-500 mb-6">For growing</p>

                            <div className="text-lg font-medium text-gray-900 mb-8">
                                10% Service fee after hiring
                            </div>

                            <p className="text-gray-600 mb-6">Everything in Basic, plus:</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-600">Instant access to pre-vetted top 1% of talent</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-600 flex items-center">
                                        Uma Recruiter
                                        <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-600">Teams controls</span>
                                </li>
                            </ul>

                            <Link
                                to="/signup"
                                className="block w-full text-center border-2 border-green-600 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors"
                            >
                                Get started for free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
