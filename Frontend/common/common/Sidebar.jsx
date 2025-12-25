import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, FileText, Briefcase, MessageSquare, CreditCard } from 'lucide-react';

export default function Sidebar({ unreadCount = 0 }) {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/proposals', icon: FileText, label: 'Proposals' },
    { to: '/contracts', icon: Briefcase, label: 'Contracts' },
    { to: '/chat', icon: MessageSquare, label: 'Chat', badge: unreadCount }
  ];

  return (
    <nav className="py-6 px-3 space-y-1">
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
    </nav>
  );
}
