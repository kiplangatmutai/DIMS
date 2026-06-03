import React, { useState } from 'react';
import { Search, Filter, Download, Wrench, ShieldAlert } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function MaintenanceQueue() {
  const [activeTab, setActiveTab] = useState<'Faulty' | 'Stolen'>('Faulty');
  const faultyIncidents: any[] = [];

  const stolenIncidents: any[] = [];

  const data = activeTab === 'Faulty' ? faultyIncidents : stolenIncidents;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Repair / Theft Queue
          </h1>
          <p className="text-neutral-500 mt-1">
            Consolidated county-wide incident tracking.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4">
          <button
            onClick={() => setActiveTab('Faulty')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'Faulty' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            <Wrench className="w-4 h-4 mr-2" />
            Faulty Devices
          </button>
          <button
            onClick={() => setActiveTab('Stolen')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'Stolen' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            <ShieldAlert className="w-4 h-4 mr-2" />
            Theft Incidents
          </button>
        </div>

        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search facility or identifier..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            
          </div>
          <select className="px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-auto">
            <option>All Sub-Counties</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket/Incident ID</th>
                <th className="px-6 py-4 font-medium">Facility</th>
                <th className="px-6 py-4 font-medium">Sub-County</th>
                <th className="px-6 py-4 font-medium">Device</th>
                <th className="px-6 py-4 font-medium">Identifier</th>
                <th className="px-6 py-4 font-medium">
                  {activeTab === 'Faulty' ? 'Issue' : 'OB Number'}
                </th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.map((item) =>
              <tr
                key={item.id}
                className="hover:bg-neutral-50 cursor-pointer">
                
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-900">{item.facilityName}</div>
                    <div className="text-xs text-neutral-500">
                      {item.facility}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {item.subCounty}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{item.device}</td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-600">
                    {item.identifier}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 truncate max-w-[200px]">
                    {activeTab === 'Faulty' ?
                  (item as any).issue :
                  (item as any).obNumber}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={item.status as any} />
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{item.date}</td>
                </tr>
              )}
              {data.length === 0 ?
              <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-neutral-500">
                    No incidents found.
                  </td>
                </tr> :
              null}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}
