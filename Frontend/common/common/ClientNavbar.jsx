import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useThemeStore } from '../../store/useThemeStore.js';
import { Search, ChevronDown, HelpCircle, User, LogOut, Settings, Moon, Sun, UserPlus, CreditCard, Gem, ArrowRight, Monitor, Check, Users, Briefcase, FileText } from 'lucide-react';
import BellNotification from './Bell.jsx';

export default function ClientNavbar() {
  const { user, token, logout } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('talent'); // 'talent', 'projects', 'jobs'
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showHireTalentDropdown, setShowHireTalentDropdown] = useState(false);
  const [showManageWorkDropdown, setShowManageWorkDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
        setShowThemeSubmenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userAvatar = user?.avatar?.url || user?.avatar || user?.profilePicture?.url || user?.profilePicture || '';
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=10b981&color=fff&rounded=true&size=128`;

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'Auto';
  };

  const getSearchTypeLabel = () => {
    if (searchType === 'talent') return 'Talent';
    if (searchType === 'projects') return 'Projects';
    return 'Jobs';
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate based on search type
    if (searchType === 'talent') {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    } else if (searchType === 'jobs') {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    } else if (searchType === 'projects') {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`); // Can be updated to projects page when available
    }

    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/nx/client/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Freelancer</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* Hire talent */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowHireTalentDropdown(true)}
                  onMouseLeave={() => setShowHireTalentDropdown(false)}
                  className="flex items-center text-gray-700 text-sm hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Hire talent
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {showHireTalentDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2 z-50 dark:bg-slate-900 dark:border-slate-800"
                    onMouseEnter={() => setShowHireTalentDropdown(true)}
                    onMouseLeave={() => setShowHireTalentDropdown(false)}
                  >
                    <Link to="/nx/job-post/chat" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      Post a job
                    </Link>
                    <Link to="/jobs" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      Browse talent
                    </Link>
                  </div>
                )}
              </div>

              {/* Manage work */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowManageWorkDropdown(true)}
                  onMouseLeave={() => setShowManageWorkDropdown(false)}
                  className="flex items-center text-gray-700 text-sm hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Manage work
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {showManageWorkDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2 z-50 dark:bg-slate-900 dark:border-slate-800"
                    onMouseEnter={() => setShowManageWorkDropdown(true)}
                    onMouseLeave={() => setShowManageWorkDropdown(false)}
                  >
                    <Link to="/contracts" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      Active contracts
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      My jobs
                    </Link>
                  </div>
                )}
              </div>

              {/* Reports */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowReportsDropdown(true)}
                  onMouseLeave={() => setShowReportsDropdown(false)}
                  className="flex items-center text-gray-700 text-sm hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Reports
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {showReportsDropdown && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-2 z-50 dark:bg-slate-900 dark:border-slate-800"
                    onMouseEnter={() => setShowReportsDropdown(true)}
                    onMouseLeave={() => setShowReportsDropdown(false)}
                  >
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      Overview
                    </Link>
                    <Link to="/payments" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      Financial reports
                    </Link>
                  </div>
                )}
              </div>

              {/* Messages */}
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `text-gray-700 text-sm hover:text-gray-900 dark:text-slate-300 dark:hover:text-white ${isActive ? 'text-green-600 dark:text-green-500' : ''
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
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                <div className="absolute right-0 flex items-center">
                  <button
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-r-lg border-l border-gray-300 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    {getSearchTypeLabel()}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                </div>
              </div>
              {showSearchDropdown && (
                <div className="absolute right-0 top-full mt-1 w-72 rounded-xl border border-gray-200 bg-white shadow-xl py-2 z-50 dark:bg-slate-900 dark:border-slate-800">
                  <button
                    onClick={() => { setSearchType('talent'); setShowSearchDropdown(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-start gap-3 group transition-colors"
                  >
                    <div className="mt-1"><Users size={20} className="text-gray-500 group-hover:text-green-600 dark:text-slate-400 transition-colors" /></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Talent</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">Find freelancers and agencies</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setSearchType('projects'); setShowSearchDropdown(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-start gap-3 group transition-colors"
                  >
                    <div className="mt-1"><Briefcase size={20} className="text-gray-500 group-hover:text-green-600 dark:text-slate-400 transition-colors" /></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Projects</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">See projects from other pros</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setSearchType('jobs'); setShowSearchDropdown(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-start gap-3 group transition-colors"
                  >
                    <div className="mt-1"><FileText size={20} className="text-gray-500 group-hover:text-green-600 dark:text-slate-400 transition-colors" /></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Jobs</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">View jobs posted by clients</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Help Icon */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors dark:text-slate-300 dark:hover:bg-slate-800">
              <HelpCircle size={20} />
            </button>

            {/* Notifications */}
            {token && <BellNotification />}


            {/* User Profile */}
            {token && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={userAvatar || fallbackAvatar}
                    alt={user?.firstName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-green-500 transition-colors"
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50 dark:bg-slate-900 dark:border-slate-800">
                    {/* User Info Header */}
                    <div className="p-4 flex items-center gap-3">
                      <img
                        src={userAvatar || fallbackAvatar}
                        alt={user?.firstName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Basic</p>
                      </div>
                    </div>

                    {/* Online Toggle */}
                    <div className="px-4 pb-4 flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-slate-300">Online for messages</span>
                      <button className="w-10 h-6 bg-green-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </button>
                    </div>

                    {/* Promo Card */}
                    <div className="px-4 pb-4">
                      <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-4 relative overflow-hidden dark:bg-slate-800 dark:border-slate-700 group cursor-pointer hover:border-green-500 transition-colors">
                        <div className="flex items-start justify-between mb-2 relative z-10">
                          <div className="flex items-center gap-2">
                            <Gem size={16} className="text-gray-900 dark:text-white" />
                            <span className="font-medium text-gray-900 text-sm dark:text-white">Try Business Plus</span>
                          </div>
                          <ArrowRight size={16} className="text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-xs text-gray-600 relative z-10 leading-relaxed dark:text-slate-400">
                          Upgrade for quicker access to the top 1% of freelancers. No upfront costs.
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 border-t border-gray-100 dark:border-slate-800">
                      <button className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 text-sm dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        <CreditCard size={18} />
                        <span>Membership plan</span>
                      </button>
                      <button className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 text-sm dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        <UserPlus size={18} />
                        <span>Invite a coworker</span>
                      </button>

                      {/* Theme Toggle */}
                      <div className="relative group">
                        <button
                          onMouseEnter={() => setShowThemeSubmenu(true)}
                          className="w-full px-4 py-3 flex items-center justify-between text-gray-700 hover:bg-gray-50 text-sm dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {getThemeIcon()}
                            <span>Theme: {getThemeLabel()}</span>
                          </div>
                          <ChevronDown size={16} className="-rotate-90" />
                        </button>

                        {/* Theme Submenu - Floating to the left */}
                        {showThemeSubmenu && (
                          <div
                            className="absolute right-full top-0 mr-2 w-72 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden dark:bg-slate-900 dark:border-slate-800"
                            onMouseEnter={() => setShowThemeSubmenu(true)}
                            onMouseLeave={() => setShowThemeSubmenu(false)}
                          >
                            <div className="py-2">
                              <button
                                onClick={() => { setTheme('auto'); setShowThemeSubmenu(false); }}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <div className="mt-0.5"><Monitor size={18} className="text-gray-600 dark:text-slate-400" /></div>
                                <div className="text-left flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Auto</span>
                                    {theme === 'auto' && <Check size={16} className="text-green-600" />}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Use the same theme as your device</p>
                                </div>
                              </button>
                              <button
                                onClick={() => { setTheme('light'); setShowThemeSubmenu(false); }}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <div className="mt-0.5"><Sun size={18} className="text-gray-600 dark:text-slate-400" /></div>
                                <div className="text-left flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                                    {theme === 'light' && <Check size={16} className="text-green-600" />}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Light background with dark text</p>
                                </div>
                              </button>
                              <button
                                onClick={() => { setTheme('dark'); setShowThemeSubmenu(false); }}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <div className="mt-0.5"><Moon size={18} className="text-gray-600 dark:text-slate-400" /></div>
                                <div className="text-left flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                                    {theme === 'dark' && <Check size={16} className="text-green-600" />}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Dark background with light text</p>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link to="/nx/client-info" className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 text-sm dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        <Settings size={18} />
                        <span>Account settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-2 dark:border-slate-800">
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <LogOut size={18} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
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
