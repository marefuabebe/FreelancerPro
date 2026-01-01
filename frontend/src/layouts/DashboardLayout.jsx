import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar.jsx'
import { useNotificationStore } from '../store/useNotificationStore.js'
import { useSocket } from '../hooks/useSocket.js'
import { useUserStore } from '../store/useUserStore.js'
import { Search } from 'lucide-react'

export default function DashboardLayout() {
    const { fetch, unreadCount } = useNotificationStore()
    const { loadProfile } = useUserStore()
    const socketRef = useSocket()

    useEffect(() => {
        fetch()
        loadProfile()
    }, [fetch, loadProfile])

    useEffect(() => {
        const socket = socketRef.current
        if (!socket) return
        const handler = (n) => {
            // Lightweight refresh on new notification
            fetch()
        }
        socket.on('notification', handler)
        return () => { socket.off('notification', handler) }
    }, [socketRef, fetch])

    return (
        <div className="min-h-screen grid grid-cols-12">
            <aside className="col-span-3 lg:col-span-2 border-r border-gray-200 dark:border-slate-800" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <Sidebar unreadCount={unreadCount} />
            </aside>
            <main className="col-span-9 lg:col-span-10">
                <div className="h-14 border-b flex items-center justify-between px-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="relative w-72 max-w-full">
                        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input placeholder="Search..." className="border rounded pl-7 pr-2 py-1.5 text-sm w-full" />
                    </div>
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
