import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/shell/Sidebar';
import { TopBar } from '../components/shell/TopBar';
import { useRole } from '../context/RoleContext';
export function AppShell() {
  const { isAuthenticated } = useRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}
