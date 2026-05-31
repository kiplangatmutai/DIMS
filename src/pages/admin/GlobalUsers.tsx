import React from 'react';
import { Search, ShieldAlert, UserX } from 'lucide-react';
export function GlobalUsers() {
  const users = [
  {
    id: 'USR-001',
    name: 'System Admin',
    email: 'admin@dims.go.ke',
    role: 'Super Admin',
    tenant: 'Global',
    status: 'Active'
  },
  {
    id: 'USR-002',
    name: 'DHA Director',
    email: 'director@dha.go.ke',
    role: 'DHA Admin',
    tenant: 'DHA Central',
    status: 'Active'
  },
  {
    id: 'USR-003',
    name: 'Vendor Manager',
    email: 'manager@healthtech.com',
    role: 'Vendor Admin',
    tenant: 'HealthTech',
    status: 'Active'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Global User Management
          </h1>
          <p className="text-neutral-500 mt-1">
            Universal access control and administrative provisioning.
          </p>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 flex items-start">
        <ShieldAlert className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-brand-800">
          <strong>Super Admin Privileges:</strong> Actions taken here affect the
          entire system. You have the exclusive power to universally
          deactivate/disable users across all system profiles.
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or ID globally..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
          <select className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-auto">
            <option>All Tenants</option>
            <option>DHA Central</option>
            <option>County Level</option>
            <option>Vendors</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Role & Tenant</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">
                  Universal Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) =>
              <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {user.email} • {user.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-900">{user.role}</div>
                    <div className="text-xs text-neutral-500">
                      {user.tenant}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-600 hover:text-brand-800 font-medium text-sm flex items-center justify-end w-full">
                      <UserX className="w-4 h-4 mr-1" />
                      Disable Globally
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}