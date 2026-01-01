import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

export default function PublicRoute() {
    const { user, token, loading } = useAuthStore((s) => ({
        user: s.user,
        token: s.token,
        loading: s.loading
    }))
    const location = useLocation()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>
    }

    if (token && user) {
        // If user is authenticated, redirect them based on their status

        // 1. Check onboarding status
        if (!user.onboardingCompleted) {
            if (user.role === 'client') {
                return <Navigate to="/nx/job-post/chat" replace />
            } else if (user.role === 'freelancer') {
                return <Navigate to="/nx/create-profile" replace />
            }
        }

        // 2. If onboarding is complete, redirect to last route or role-specific home
        const from = location.state?.from?.pathname
        if (from && from !== '/login' && from !== '/register' && from !== '/signup' && from !== '/') {
            return <Navigate to={from} replace />
        }

        if (user.role === 'client') {
            return <Navigate to="/nx/client/dashboard" replace />
        } else if (user.role === 'freelancer') {
            return <Navigate to="/nx/find-work/best-matches" replace />
        } else if (user.role === 'admin' || user.role === 'superadmin') {
            return <Navigate to="/admin/dashboard" replace />
        }

        // Fallback
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
