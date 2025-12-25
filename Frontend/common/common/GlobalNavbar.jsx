import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import Bell from './Bell.jsx'
import SearchBar from './SearchBar.jsx'
import UserDropdown from './UserDropdown.jsx'

export default function GlobalNavbar() {
  const { user, logout, token } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-colors duration-200" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Freelancer</span>
            </Link>
          </div>

          {/* Right side - User avatar positioned in top-right */}
          <div className="flex items-center">
            {token && user ? (
              <UserDropdown user={user} avatar={user?.avatar?.url || (typeof user?.avatar === 'string' ? user?.avatar : null)} />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
