import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, FileText, Briefcase, MessageSquare, CreditCard, ChevronRight } from 'lucide-react';
import ProfileCompletionModal from '../dashboard/ProfileCompletionModal.jsx';
import { useAuthStore } from '../../store/useAuthStore.js';
import { calculateProfileCompletion } from '../../utils/profileCompletion.js';

export default function Sidebar({ unreadCount = 0 }) {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // Calculate percentage using shared utility
  useEffect(() => {
    const { percentage: completionPercentage } = calculateProfileCompletion(user);
    setPercentage(completionPercentage);
  }, [user]);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/proposals', icon: FileText, label: 'Proposals' },
    { to: '/contracts', icon: Briefcase, label: 'Contracts' },
    { to: '/chat', icon: MessageSquare, label: 'Chat', badge: unreadCount }
  ];

  return (
    <nav className="h-full flex flex-col py-6 px-3">
      <div className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm border border-green-100'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-green-600' : 'text-gray-500'
                      }`}
                  />
                  <span>{item.label}</span>
                </span>
                {item.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-2 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Profile Completion Widget */}
      {percentage < 100 && (
        <div className="mt-6 mx-2 p-4 bg-green-50 rounded-xl border border-green-100 cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setShowModal(true)}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-bold text-green-800">Complete your profile</span>
            <span className="text-xs font-semibold text-white bg-green-600 px-2 py-0.5 rounded-full">{percentage}%</span>
          </div>
          <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center text-xs text-green-700 font-medium group-hover:underline">
            <span>Add missing details</span>
            <ChevronRight className="w-3 h-3 ml-1" />
          </div>
        </div>
      )}

      {/* Modal */}
      <ProfileCompletionModal open={showModal} onClose={() => setShowModal(false)} />
    </nav>
  );
}
