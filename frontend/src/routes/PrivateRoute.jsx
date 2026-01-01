import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = () => {
    const { user, loading } = useAuth()

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Render child routes if authenticated
    return <Outlet />
}

export default PrivateRoute
