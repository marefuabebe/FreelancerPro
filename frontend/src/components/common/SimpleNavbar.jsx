import { Link } from 'react-router-dom'

export default function SimpleNavbar() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <div className="w-11 h-9 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                                <h2 className="text-white font-bold text-sm mb-0">Pro</h2>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Freelancer</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
