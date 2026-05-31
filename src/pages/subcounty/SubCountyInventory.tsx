import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { MOCK_INVENTORY, FACILITIES } from '../../data/mockData';
export function SubCountyInventory() {
  // Mock data expanded for Sub-County view
  const inventory = [
  ...MOCK_INVENTORY,
  {
    id: 'INV-005',
    deviceType: 'Tablet',
    imei: '354920108472999',
    serial: null,
    status: 'Device Accepted',
    dateReceived: '2025-11-01',
    facilityId: 'HF-10294'
  }];

  const getFacilityName = (id: string) =>
  FACILITIES.find((f) => f.id === id)?.name || id;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Sub-County Inventory
          </h1>
          <p className="text-neutral-500 mt-1">
            Cross-facility visibility for Langata Sub-County.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export Ledger
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search Facility, IMEI, or Serial..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
            
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <select className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500">
              <option>All Facilities</option>
              <option>Mbagathi County Hospital</option>
              <option>Pumwani Maternity</option>
            </select>
            <button className="flex items-center px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Facility</th>
                <th className="px-6 py-4 font-medium">Device Type</th>
                <th className="px-6 py-4 font-medium">IMEI 1</th>
                <th className="px-6 py-4 font-medium">Serial No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {inventory.map((inv) =>
              <tr
                key={inv.id}
                className="hover:bg-neutral-50 transition-colors">
                
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">
                      {getFacilityName(inv.facilityId)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {inv.facilityId}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-900">
                    {inv.deviceType}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs">
                    {inv.imei || '-'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs">
                    {inv.serial || '-'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}