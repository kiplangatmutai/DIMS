import React from 'react';
import { Shield, PlusCircle, Search } from 'lucide-react';
export function RoleProvisioning() {
  const users = [
  {
    id: 'USR-DHA-001',
    name: 'Dr. Sarah Kimani',
    email: 'skimani@dha.go.ke',
    role: 'DHA Approval Officer',
    status: 'Active'
  },
  {
    id: 'USR-DHA-002',
    name: 'John Mwangi',
    email: 'jmwangi@dha.go.ke',
    role: 'DHA Inventory Officer',
    status: 'Active'
  },
  {
    id: 'USR-DHA-003',
    name: 'Grace Ochieng',
    email: 'gochieng@dha.go.ke',
    role: 'DHA Onboarding Officer',
    status: 'Active'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            DHA Internal Role Provisioning
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage DHA operational team members and permissions.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add DHA User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search DHA users..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
          <select className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-auto">
            <option>All Roles</option>
            <option>DHA Approval Officer</option>
            <option>DHA Inventory Officer</option>
            <option>DHA Onboarding Officer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) =>
              <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-neutral-500">{user.id}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-600 hover:text-brand-800 font-medium text-sm">
                      Edit
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