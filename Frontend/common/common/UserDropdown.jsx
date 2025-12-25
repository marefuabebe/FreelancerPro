import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';

export default function UserDropdown({ user, avatar }) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    // console.log('👤 [UserDropdown] Rendering with user:', user, 'avatar:', avatar);
    const [showDropdown, setShowDropdown] = useState(false);
    const avatarBtnRef = useRef();
    const dropdownRef = useRef();

    // Close dropdown on click outside or escape
    useEffect(() => {
        if (!showDropdown) return;
        function handler(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                avatarBtnRef.current &&
                !avatarBtnRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        }
        function handleEsc(e) {
            if (e.key === 'Escape') setShowDropdown(false);
        }
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [showDropdown]);

    const handleAvatarClick = (e) => {
        e.preventDefault(); // Prevent navigation if wrapped in Link
        setShowDropdown((s) => !s);
    };

    const handleCloseAccount = () => {
        setShowDropdown(false);
        alert('Account closing functionality coming soon.');
    };

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
        navigate('/login');
    };

    return (
        <div className="relative">
            <button
                ref={avatarBtnRef}
                type="button"
                aria-label="Account"
                onClick={handleAvatarClick}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none bg-white p-0 overflow-hidden"
            >
                {avatar ? (
                    <img
                        src={avatar}
                        alt={user?.firstName || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=10b981&color=fff&rounded=true&size=128`;
                        }}
                    />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6 text-gray-700">
                        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                        <path d="M3 21a9 9 0 0 1 18 0" />
                    </svg>
                )}
            </button>
            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 top-12 right-0 rounded-2xl shadow-xl border border-gray-200 bg-white w-80 p-8 pt-7 pb-6 flex flex-col items-center animate-fadeIn"
                    style={{ minWidth: '275px' }}
                >
                    {/* Arrow */}
                    <div className="absolute -top-3 right-4 w-6 h-6">
                        <svg width="100%" height="100%" viewBox="0 0 24 24">
                            <polygon points="12,0 24,24 0,24" className="fill-white stroke-gray-200" />
                        </svg>
                    </div>

                    {/* Large Avatar in Dropdown */}
                    <div className="w-24 h-24 flex items-center justify-center rounded-full border border-gray-300 mb-3 overflow-hidden">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={user?.firstName || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=10b981&color=fff&rounded=true&size=128`;
                                }}
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" stroke="#bbb" strokeWidth={2} className="w-20 h-20">
                                <circle cx="24" cy="18" r="8" />
                                <path d="M8 42a16 16 0 0 1 32 0" />
                            </svg>
                        )}
                    </div>

                    {/* Name and Role */}
                    <div className="text-xl font-semibold text-gray-900 text-center mb-0">
                        {user?.firstName || 'User'} {user?.lastName || ''}
                    </div>
                    <div className="text-gray-500 text-sm mb-4 text-center capitalize">{user?.role || 'Freelancer'}</div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 w-full mt-2">
                        <button
                            onClick={handleCloseAccount}
                            className="flex items-center w-full gap-3 px-4 py-2 rounded-lg text-[17px] font-medium hover:bg-gray-50 transition-colors text-gray-900"
                        >
                            <span className="inline-flex w-7 h-7 items-center justify-center">
                                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M9.5 15.5L14 11l-1-3.5L15.5 9" />
                                </svg>
                            </span>
                            Close Account
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-3 px-4 py-2 rounded-lg text-[17px] font-medium hover:bg-gray-50 transition-colors text-gray-900"
                        >
                            <span className="inline-flex w-7 h-7 items-center justify-center">
                                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M16 17l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
                                </svg>
                            </span>
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
