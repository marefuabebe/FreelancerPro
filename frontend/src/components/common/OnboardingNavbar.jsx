import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import UserDropdown from './UserDropdown.jsx';

export default function OnboardingNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const goHome = () => navigate('/')

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-3 select-none"
        >
          <div className="w-11 h-9 bg-green-500 rounded-lg flex items-center justify-center mr-2">
            <h2 className="text-white font-bold text-sm mb-0">Pro</h2>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Freelancer</span>
        </button>
        <UserDropdown user={user} avatar={null} />
      </div>
    </header>
  );
}


