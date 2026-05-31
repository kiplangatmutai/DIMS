import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import * as Icons from 'lucide-react';
import { Logo } from '../ui/Logo';
export function Sidebar() {
  const { currentRole } = useRole();
  return (
    <div className="w-64 bg-brand-600 text-white flex flex-col h-full shadow-xl z-10">
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
      </div>

      <div className="px-6 py-4 border-b border-brand-700">
        <div className="text-xs text-brand-200 uppercase tracking-wider font-semibold mb-1">
          Current Role
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
    </div>);

}