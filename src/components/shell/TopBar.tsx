import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { ROLES } from '../../data/roles';
import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();
  const { currentRole, setCurrentRole } = useRole();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

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
        {/* Role Switcher (Demo Only) */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 border border-accent-200 bg-accent-50 text-accent-700 rounded-md text-sm font-medium hover:bg-accent-100 transition-colors">
            
            <span>Demo: Switch Role</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isRoleMenuOpen &&
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-neutral-200 py-1 max-h-96 overflow-y-auto z-50">
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-50">
                Select Role to Preview
              </div>
              {ROLES.map((role) =>
            <button
              key={role.id}
              onClick={() => {
                setCurrentRole(role);
                setIsRoleMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 ${currentRole.id === role.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-neutral-700'}`}>
              
                  <div className="font-medium">{role.name}</div>
                  <div className="text-xs text-neutral-500">
                    {role.tier} Tier
                  </div>
                </button>
            )}
            </div>
          }
        </div>

        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-neutral-400 hover:text-neutral-500 transition-colors">
          
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center space-x-2 pl-4 border-l border-neutral-200">
          <UserCircle className="h-8 w-8 text-neutral-400" />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-neutral-700">Jane Doe</div>
            <div className="text-xs text-neutral-500">{currentRole.name}</div>
          </div>
        </div>
      </div>
    </header>);

}