import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import Bell from './Bell.jsx'
import SearchBar from './SearchBar.jsx'

export default function Navbar() {
  const { user, logout, token } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <SearchBar 
              onResultSelect={(item, type) => {
                if (type === 'job') {
                  window.location.href = `/jobs/${item.id || item._id}`
                } else if (type === 'user') {
                  window.location.href = `/profile/${item.id || item._id}`
                }
              }}
            />
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <NavLink 
              to="/jobs" 
              className={({isActive}) => 
                `text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-gray-700 hover:text-green-600'
                }`
              }
            >
              Find Work
            </NavLink>
            <NavLink 
              to="/about" 
              className={({isActive}) => 
                `text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-gray-700 hover:text-green-600'
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({isActive}) => 
                `text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-gray-700 hover:text-green-600'
                }`
              }
            >
              Contact
            </NavLink>
            
            {token && <Bell />}
            
            {!token ? (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Log In
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName || 'User'}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
