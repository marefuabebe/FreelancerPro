import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'

export default function AdminLogin() {
    const navigate = useNavigate()
    const { loginAdmin, loading, error } = useAuthStore((s) => ({
        loginAdmin: s.loginAdmin,
        loading: s.loading,
        error: s.error,
    }))
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // Redirect if already logged in as admin
    useState(() => {
        const user = useAuthStore.getState().user
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            navigate('/admin/dashboard', { replace: true })
        }
    }, [navigate])

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await loginAdmin({ email, password })

            // Check user role immediately after login
            const user = useAuthStore.getState().user

            if (user?.role === 'admin' || user?.role === 'superadmin') {
                toast.success('Welcome back, Administrator!')
                navigate('/admin/dashboard')
            } else {
                // If not admin, logout and show error
                // We don't want non-admins logging in via this portal
                toast.error('Access denied. This portal is for administrators only.')
                // Optional: logout immediately if you want to enforce strict separation
                // useAuthStore.getState().logout() 
                // For now, just redirect them to their appropriate dashboard or home
                if (user.role === 'client') navigate('/jobs')
                else if (user.role === 'freelancer') navigate('/nx/find-work/best-matches')
                else navigate('/')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || error || 'Login failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-10 w-10 text-blue-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Secure access for platform administrators
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="••••••••"
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
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 transition-colors duration-200"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
