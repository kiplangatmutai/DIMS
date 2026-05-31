import React, { useState } from 'react';
import { Search, Filter, Wrench, ShieldAlert } from 'lucide-react';
import { MOCK_INVENTORY } from '../../data/mockData';
import { StatusPill } from '../../components/ui/StatusPill';
export function ActiveInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Active Inventory
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage and track devices currently assigned to this facility.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search IMEI or Serial Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
            
          </div>
          <button className="flex items-center px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Type
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Device Type</th>
                <th className="px-6 py-4 font-medium">IMEI 1</th>
                <th className="px-6 py-4 font-medium">Serial No</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Received</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {MOCK_INVENTORY.map((inv) =>
              <tr
                key={inv.id}
                className="hover:bg-neutral-50 transition-colors group">
                
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {inv.deviceType}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs">
                    {inv.imei || '-'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs">
                    {inv.serial || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={inv.status as any} />
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {inv.dateReceived}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                      className="text-amber-600 hover:text-amber-800 font-medium text-xs flex items-center bg-amber-50 px-2 py-1 rounded"
                      disabled={inv.status !== 'Device Accepted'}>
                      
                        <Wrench className="w-3 h-3 mr-1" />
                        Report Faulty
                      </button>
                      <button
                      className="text-brand-600 hover:text-brand-800 font-medium text-xs flex items-center bg-brand-50 px-2 py-1 rounded"
                      disabled={inv.status !== 'Device Accepted'}>
                      
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Report Stolen
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}