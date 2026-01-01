import { Outlet } from 'react-router-dom'
import Footer from '../components/common/Footer.jsx'

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200">
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
