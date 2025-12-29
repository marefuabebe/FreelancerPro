import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.js'
import toast from 'react-hot-toast'

export default function LoginForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        login,
        loading,
        error,
        verificationRequired,
        pendingEmail,
        emailVerificationSent,
        resendVerification,
        resendVerificationLoading,
    } = useAuthStore((s) => ({
        login: s.login,
        loading: s.loading,
        error: s.error,
        verificationRequired: s.verificationRequired,
        pendingEmail: s.pendingEmail,
        emailVerificationSent: s.emailVerificationSent,
        resendVerification: s.resendVerification,
        resendVerificationLoading: s.resendVerificationLoading,
    }))
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const user = await login({ email, password })
            toast.success('Welcome back!')

            // Redirect based on user role and onboarding status
            if (!user) {
                // Fallback if user data is not returned
                const storeUser = useAuthStore.getState().user
                if (storeUser) {
                    redirectUser(storeUser)
                } else {
                    navigate('/')
                }
                return
            }

            redirectUser(user)
        } catch (err) {
            toast.error(err.response?.data?.message || error || 'Login failed. Please try again.')
        }
    }

    const redirectUser = (user) => {
        console.log('👤 Redirecting user:', user?.role, 'Onboarding:', user?.onboardingCompleted)

        // Admin redirect
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            navigate('/admin/dashboard')
            return
        }

        // Client redirect
        if (user?.role === 'client') {
            if (user?.onboardingCompleted) {
                navigate('/nx/client/dashboard')
            } else {
                navigate('/nx/job-post/chat')
            }
            return
        }

        // Freelancer redirect
        if (user?.role === 'freelancer') {
            if (user?.onboardingCompleted) {
                navigate('/nx/find-work/best-matches')
            } else {
                navigate('/nx/create-profile')
            }
            return
        }

        // Fallback
        navigate('/')
    }

    const handleResend = async () => {
        const targetEmail = pendingEmail || email
        if (!targetEmail) {
            toast.error('Enter your email to resend verification')
            return
        }
        try {
            const { data } = await resendVerification(targetEmail)
            toast.success(`Verification email sent to ${targetEmail}`)

            // Check for dev mode verification URL
            const verificationUrl = data?.data?.verificationUrl || data?.verificationUrl
            if (verificationUrl) {
                toast((t) => (
                    <div className="flex flex-col gap-2">
                        <span>Development Mode:</span>
                        <a
                            href={verificationUrl}
                            className="text-blue-600 underline font-bold"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Verify Email Directly
                        </a>
                    </div>
                ), { duration: 10000 })
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Unable to resend verification email')
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">F</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
                <p className="text-gray-600 mt-2 dark:text-gray-400">Sign in to your account</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="Enter your email address"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                        to="/reset-password"
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
                {verificationRequired && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
                        <p className="text-yellow-800 text-sm">
                            Please verify the email <span className="font-medium">{pendingEmail || email || 'you used during signup'}</span> to continue.
                        </p>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendVerificationLoading}
                            className="text-sm font-semibold text-yellow-900 underline hover:text-yellow-700 disabled:text-yellow-500"
                        >
                            {resendVerificationLoading ? 'Sending verification email...' : 'Resend verification email'}
                        </button>
                        {emailVerificationSent && (
                            <p className="text-sm text-green-700">
                                A new verification link has been sent to {pendingEmail || email}.
                            </p>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                {/* Social Login */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 4.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="ml-2">Google</span>
                        </button>

                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                            <span className="ml-2">Twitter</span>
                        </button>
                    </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
