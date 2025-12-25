import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
import UserDropdown from './UserDropdown.jsx';
import BellNotification from './Bell.jsx';

export default function FindWorkNavbar() {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showFindWorkDropdown, setShowFindWorkDropdown] = useState(false);
  const [showDeliverWorkDropdown, setShowDeliverWorkDropdown] = useState(false);
  const [showManageFinancesDropdown, setShowManageFinancesDropdown] = useState(false);

  // Get avatar from user object - check multiple possible locations
  const userAvatar = user?.avatar?.url || user?.avatar || user?.profilePicture?.url || user?.profilePicture || '';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Freelancer</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* Find work */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowFindWorkDropdown(true)}
                  onMouseLeave={() => setShowFindWorkDropdown(false)}
                  className="flex items-center text-green-600 font-medium text-sm hover:text-green-700"
                >
                  Find work
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {showFindWorkDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2"
                    onMouseEnter={() => setShowFindWorkDropdown(true)}
                    onMouseLeave={() => setShowFindWorkDropdown(false)}
                  >
                    <Link to="/nx/find-work/best-matches" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      Browse jobs
                    </Link>
                    <Link to="/proposals" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      My proposals
                    </Link>
                    <Link to="/contracts" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      My contracts
                    </Link>
                  </div>
                )}
              </div>

              {/* Deliver work */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowDeliverWorkDropdown(true)}
                  onMouseLeave={() => setShowDeliverWorkDropdown(false)}
                  className="flex items-center text-gray-700 font-medium text-sm hover:text-gray-900"
                >
                  Deliver work
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {showDeliverWorkDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2"
                    onMouseEnter={() => setShowDeliverWorkDropdown(true)}
                    onMouseLeave={() => setShowDeliverWorkDropdown(false)}
                  >
                    <Link to="/contracts" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      Active contracts
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      My work
                    </Link>
                  </div>
                )}
              </div>

              {/* Manage finances */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowManageFinancesDropdown(true)}
                  onMouseLeave={() => setShowManageFinancesDropdown(false)}
                  className="flex items-center text-gray-700 font-medium text-sm hover:text-gray-900"
                >
                  Manage finances
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {showManageFinancesDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2"
                    onMouseEnter={() => setShowManageFinancesDropdown(true)}
                    onMouseLeave={() => setShowManageFinancesDropdown(false)}
                  >
                    <Link to="/payments" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      Payments
                    </Link>
                    <Link to="/payments" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      Earnings
                    </Link>
                  </div>
                )}
              </div>

              {/* Messages */}
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `text-gray-700 font-medium text-sm hover:text-gray-900 ${isActive ? 'text-green-600' : ''
                  }`
                }
              >
                Messages
              </NavLink>
            </nav>
          </div>

          {/* Right Side - Search and User Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Component */}
            <div className="relative flex items-center">
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
                <div className="absolute right-0 flex items-center">
                  <button
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-r-lg border-l border-gray-300"
                  >
                    Jobs
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                </div>
              </div>
              {showSearchDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg py-2 z-50">
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                    Jobs
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                    Freelancers
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                    Projects
                  </button>
                </div>
              )}
            </div>

            {/* Help Icon */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <HelpCircle size={20} />
            </button>

            {/* Notifications */}
            {token && <BellNotification />}


            {/* User Profile */}
            {token && user ? (
              <UserDropdown user={user} avatar={userAvatar} />
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

