import { Outlet, useLocation } from 'react-router-dom'

export default function AuthLayout() {
    const location = useLocation()

    // For role selection, verify-email, and signup/verify, use full screen layout
    if (location.pathname === '/signup' || location.pathname === '/verify-email' || location.pathname === '/signup/verify') {
        return <Outlet />
    }

    // For other auth pages, use centered layout
    return (
        <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-full max-w-md">
                <div className="rounded-2xl shadow-xl border p-8 transition-colors duration-200" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
