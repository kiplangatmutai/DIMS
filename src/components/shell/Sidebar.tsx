import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import * as Icons from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentRole } = useRole();
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-neutral-950/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col bg-brand-600 text-white shadow-xl transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-20 flex items-center px-5 border-b border-brand-700">
          <Logo variant="light" />
          <div className="ml-3 leading-tight">
            <div className="font-bold text-base tracking-tight text-white">
              DIMS
            </div>
            <div className="text-[10px] text-brand-200 uppercase tracking-wider">
              Inventory Platform
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto rounded-md p-2 text-brand-100 hover:bg-brand-700 hover:text-white lg:hidden">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-brand-700">
          <div className="text-xs text-brand-200 uppercase tracking-wider font-semibold mb-1">
            Signed in as
          </div>
          <div className="font-medium truncate" title={currentRole.name}>
            {currentRole.name}
          </div>
          <div className="text-xs text-brand-200 mt-0.5">
            {currentRole.tier} Tier
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {currentRole.routes.map((route) => {
            const IconComponent = (Icons as any)[route.icon] || Icons.Circle;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={onClose}
                className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700 hover:text-white'}`
                }>
                <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                {route.label}
              </NavLink>);

          })}
        </nav>

        <div className="p-4 border-t border-brand-700">
          <div className="flex items-center text-sm text-brand-200">
            <Icons.Shield className="w-4 h-4 mr-2" />
            Secured by DHA
          </div>
        </div>
      </aside>
    </>);

}
