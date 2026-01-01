import { Link } from 'react-router-dom'
import HomeNavbar from '../components/home/HomeNavbar'
import Footer from '../components/common/Footer'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-green max-w-none text-gray-600">
                    <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">
                            We allow you to create an account, log in to the Services, facilitate payments, send you updates, security alerts, and support messages, and analyze our Services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                        <p className="mb-4">
                            We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including with third party service providers.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="mb-4">
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                        </p>
                    </section>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
