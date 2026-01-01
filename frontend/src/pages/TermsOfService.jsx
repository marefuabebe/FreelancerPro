import { Link } from 'react-router-dom'
import HomeNavbar from '../components/home/HomeNavbar'
import Footer from '../components/common/Footer'

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

                <div className="prose prose-green max-w-none text-gray-600">
                    <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using FreelancerPro, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="mb-4">
                            FreelancerPro provides a platform for freelancers and clients to connect, collaborate, and manage work relationships.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                        <p className="mb-4">
                            You are responsible for maintaining the security of your account and password. The company cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Content Ownership</h2>
                        <p className="mb-4">
                            All content posted on the service must comply with copyright law. You retain all rights to your content, but you grant us a license to use it to provide the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Termination</h2>
                        <p className="mb-4">
                            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
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
