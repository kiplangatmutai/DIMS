import React, { useState } from 'react';
import { Users, Search, PlusCircle, Shield, AlertCircle } from 'lucide-react';
export function UserManagement() {
  const users: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            User Management
          </h1>
          <p className="text-neutral-500 mt-1">
            Provision and manage County, Sub-County, and Facility users.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Onboard User
        </button>
      </div>

      <div className="bg-accent-50 border border-accent-100 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-accent-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-accent-800">
          <strong>HCW Registry Sync:</strong> When onboarding, the system will
          automatically attempt to pull user details from the national Health
          Care Workers registry. You may use the manual override toggle if the
          user is not found.
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <select className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500">
              <option>All Roles</option>
              <option>Facility User</option>
              <option>Sub-County Approver</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Assignment</th>
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
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {user.facility}
                  </td>
                  <td className="px-6 py-4">
                    <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-white text-black' : 'bg-brand-50 text-brand-700'}`}>
                    
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
              {users.length === 0 ?
              <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    No users found.
                  </td>
                </tr> :
              null}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}
