import { Link } from 'react-router-dom'

export default function FinalCTA() {
    return (
        <div className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-12 md:p-20 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Find your next hire for a short task or long-term growth</h2>
                    <p className="text-green-100 mb-8 text-lg max-w-2xl mx-auto">
                        Join thousands of freelancers and clients who trust our platform to deliver exceptional results
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="bg-white hover:bg-gray-50 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                        >
                            Start Freelancing
                        </Link>
                        <Link
                            to="/nx/search/talent"
                            className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                        >
                            Explore Freelancers
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
