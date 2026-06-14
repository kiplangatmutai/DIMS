import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { Bell, LogOut, Menu, Search, UserCircle } from 'lucide-react';

interface TopBarProps {
  onOpenNavigation: () => void;
}

export function TopBar({ onOpenNavigation }: TopBarProps) {
  const navigate = useNavigate();
  const { currentRole, currentUser, logout } = useRole();
  const displayName = currentUser?.name || currentUser?.username || 'Signed in user';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex min-w-0 items-center flex-1 gap-3">
        <button
          type="button"
          onClick={onOpenNavigation}
          aria-label="Open navigation"
          className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden w-full max-w-sm sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search IMEI, Serial, or Facility..."
            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-neutral-50 placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors" />
          
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3">
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          aria-label="View notifications"
          className="relative rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
          
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>

        <div className="hidden items-center space-x-2 pl-3 border-l border-neutral-200 md:flex">
          <UserCircle className="h-8 w-8 text-neutral-400" />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-neutral-700">
              {displayName}
            </div>
            <div className="text-xs text-neutral-500">{currentRole.name}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-colors">
          
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>);

}
