import { Link, NavLink, useNavigate } from 'react-router-dom'
import NavbarSearch from './NavbarSearch.jsx'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore.js'

export default function HomeNavbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center mr-6 flex-shrink-0">
              <div className="w-11 h-9 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                <h2 className="text-white font-bold text-sm mb-0">Pro</h2>
              </div>
              <span className="text-xl font-bold text-gray-900">Freelancer</span>
            </Link>

            {/* Primary nav with dropdowns */}
            <nav className="hidden lg:flex items-center space-x-5 text-gray-800 mr-6">
              {/* Hire freelancers */}
              <div className="relative group">
                <NavLink to="/" className="text-sm font-medium text-gray-600 hover:text-black flex items-center whitespace-nowrap">
                  Hire freelancers
                  <span className="ml-1 text-gray-500">▾</span>
                </NavLink>
                <div className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg hidden group-hover:block">
                  <div className="py-2 text-sm">
                    <button
                      onClick={(e) => {
                        const { user } = useAuthStore.getState();
                        if (!user?.kycVerified) {
                          e.preventDefault();
                          toast.error('Please complete KYC verification to post a job');
                          return;
                        }
                        // Navigate manually if verified
                        window.location.href = '/nx/job-post/draft';
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Post a job
                    </button>
                    <Link to="/nx/search/talent" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Talent Marketplace</Link>
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Project Catalog</Link>
                  </div>
                </div>
              </div>

              {/* Find work */}
              <div className="relative group">
                <NavLink to="/nx/find-work/best-matches" className="text-sm font-medium text-gray-600 hover:text-black flex items-center whitespace-nowrap">
                  Find work
                  <span className="ml-1 text-gray-500">▾</span>
                </NavLink>
                <div className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg hidden group-hover:block">
                  <div className="py-2 text-sm">
                    <Link to="/nx/find-work/best-matches" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Browse jobs</Link>
                    <Link to="/proposals" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My proposals</Link>
                    <Link to="/contracts" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My contracts</Link>
                  </div>
                </div>
              </div>

              {/* Why us */}
              <div className="relative group">
                <NavLink to="/about" className="text-sm font-medium text-gray-600 hover:text-black flex items-center whitespace-nowrap">
                  Why us
                  <span className="ml-1 text-gray-500">▾</span>
                </NavLink>
                <div className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg hidden group-hover:block">
                  <div className="py-2 text-sm">
                    <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Success stories</Link>
                    <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">How it works</Link>
                    <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Contact us</Link>
                  </div>
                </div>
              </div>

              <NavLink to="/pricing" className="text-sm font-medium text-gray-600 hover:text-black whitespace-nowrap">
                Pricing
              </NavLink>
              <NavLink to="/enterprise" className="text-sm font-medium text-gray-600 hover:text-black whitespace-nowrap">
                For enterprise
              </NavLink>
            </nav>

            {/* Search Bar */}
            <NavbarSearch />
          </div>

          {/* Right: Auth CTAs */}
          <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
            <NavLink to="/login" className="text-sm font-medium text-gray-800 hover:text-black whitespace-nowrap">
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 whitespace-nowrap"
            >
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}


