import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { Bell, LogOut, Search, UserCircle } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();
  const { currentRole, currentUser, logout } = useRole();
  const displayName = currentUser?.name || currentUser?.username || 'Signed in user';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-20 sticky top-0">
      <div className="flex items-center flex-1">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search IMEI, Serial, or Facility..."
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-neutral-50 placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors" />
          
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-neutral-400 hover:text-neutral-500 transition-colors">
          
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center space-x-2 pl-4 border-l border-neutral-200">
          <UserCircle className="h-8 w-8 text-neutral-400" />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-neutral-700">
              {displayName}
            </div>
            <div className="text-xs text-neutral-500">{currentRole.name}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-colors">
          
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </header>);

}
