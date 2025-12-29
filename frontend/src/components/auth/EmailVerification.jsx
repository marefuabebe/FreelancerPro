import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { resendVerificationEmail } from '../../api/authApi.js'
import toast from 'react-hot-toast'

export default function EmailVerification() {
    const location = useLocation()
    const navigate = useNavigate()
    const [email] = useState(location.state?.email || 'user@example.com')
    const [isResending, setIsResending] = useState(false)

    const handleResend = async () => {
        setIsResending(true)
        try {
            await resendVerificationEmail(email)
            toast.success('Verification email sent! Please check your inbox.')
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to resend email. Please try again.'
            toast.error(errorMessage)
        } finally {
            setIsResending(false)
        }
    }

    const handleGmailInbox = () => {
        window.open('https://mail.google.com', '_blank')
    }

    const handleBackToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header with logo */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">F</span>
                        </div>
                    </div>

                    {/* Main verification content */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            {/* Email icon with notification bubble */}
                            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-200">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {/* Notification bubble */}
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify your email to continue</h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We just sent an email to the address:{' '}
                                <span className="font-semibold text-gray-900">{email}</span>.
                                Please check your email and select the link provided to verify your address.
                            </p>
                        </div>

                        {/* Development Mode: Direct Verification Link */}
                        {location.state?.verificationUrl && (
                            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 mb-2 font-semibold">Development Mode (Email Service Bypass):</p>
                                <p className="text-xs text-blue-600 mb-2">Since email service might not be configured, use this link:</p>
                                <a
                                    href={location.state.verificationUrl}
                                    className="text-blue-600 underline break-all text-sm block"
                                >
                                    Verify Email Directly
                                </a>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="space-y-4 mb-8">
                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResending ? 'Sending...' : 'Send again'}
                            </button>

                            <button
                                onClick={handleGmailInbox}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Go to Gmail Inbox
                            </button>
                        </div>

                        {/* Help links */}
                        <div className="text-center space-y-2">
                            <p className="text-gray-600">
                                <Link to="#" className="text-green-600 hover:text-green-700 font-medium">
                                    Didn't receive email?
                                </Link>
                            </p>
                            <p className="text-gray-600">
                                <Link to="#" className="text-green-600 hover:text-green-700 font-medium">
                                    Didn't receive email?
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to login */}
                    <div className="text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer similar to Upwork */}
            <footer className="mt-16 bg-gray-800 text-white" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
                <div className="w-full px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">About Us</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Feedback</a></li>
                                <li><a href="#" className="hover:text-white">Trust</a></li>
                                <li><a href="#" className="hover:text-white">Safety & Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Help & Support</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Privacy Policy</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">CA Notice at Collection</a></li>
                                <li><a href="#" className="hover:text-white">Your Privacy Choices</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Accessibility</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Desktop App</a></li>
                                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                                <li><a href="#" className="hover:text-white">Enterprise Solutions</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex space-x-4 mb-4 md:mb-0">
                            <span className="text-sm text-gray-300">Follow Us</span>
                            <div className="flex space-x-3">
                                <a href="#" className="text-gray-400 hover:text-white">📘</a>
                                <a href="#" className="text-gray-400 hover:text-white">💼</a>
                                <a href="#" className="text-gray-400 hover:text-white">🐦</a>
                                <a href="#" className="text-gray-400 hover:text-white">📺</a>
                                <a href="#" className="text-gray-400 hover:text-white">📷</a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300">Mobile app</span>
                            <div className="flex space-x-2">
                                <a href="#" className="text-gray-400 hover:text-white">🍎</a>
                                <a href="#" className="text-gray-400 hover:text-white">🤖</a>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            © 2024-2025 FreelancerCli® Global Inc.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

