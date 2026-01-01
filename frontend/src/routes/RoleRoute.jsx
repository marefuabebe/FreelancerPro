import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

export default function RoleRoute({ allowedRoles }) {
    const user = useAuthStore((s) => s.user)
    const loading = useAuthStore((s) => s.loading)

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Case-insensitive role check
    const normalizedUserRole = user.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        console.log('⛔ RoleRoute: Access denied. User role:', normalizedUserRole, 'Allowed:', normalizedAllowedRoles)

        // Redirect to appropriate dashboard based on actual role
        if (normalizedUserRole === 'admin' || normalizedUserRole === 'superadmin') {
            return <Navigate to="/admin/dashboard" replace />
        } else if (normalizedUserRole === 'client') {
            return <Navigate to="/nx/client/dashboard" replace />
        } else if (normalizedUserRole === 'freelancer') {
            return <Navigate to="/nx/find-work/best-matches" replace />
        }
        console.log('⛔ RoleRoute: Redirecting to generic dashboard')
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
