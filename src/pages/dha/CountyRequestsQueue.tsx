import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function DHACountyRequestsQueue() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(
    'CTY-REQ-001'
  );
  const [expandedCounty, setExpandedCounty] = useState<string | null>('Nairobi');
  const requests = [
  {
    id: 'CTY-REQ-001',
    county: 'Nairobi',
    subCounties: 3,
    facilities: 12,
    totalQty: 150,
    status: 'Pending DHA',
    date: '2026-05-27'
  },
  {
    id: 'CTY-REQ-002',
    county: 'Mombasa',
    subCounties: 2,
    facilities: 8,
    totalQty: 85,
    status: 'Pending DHA',
    date: '2026-05-27'
  }];

  const breakdown = {
    county: 'Nairobi',
    subCounties: [
    {
      name: 'Langata',
      facilities: [
      {
        id: 'HF-10293',
        name: 'Mbagathi Hospital',
        device: 'Tablet',
        qty: 10
      },
      {
        id: 'HF-10294',
        name: 'Langata Health Center',
        device: 'Desktop',
        qty: 3
      }]

    },
    {
      name: 'Kamukunji',
      facilities: [
      {
        id: 'HF-10295',
        name: 'Pumwani Maternity',
        device: 'Tablet',
        qty: 8
      }]

    }]

  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          County Requests Queue
        </h1>
        <p className="text-neutral-500 mt-1">
          Final DHA authorization and vendor routing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search county..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
              
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
            {requests.map((req) =>
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req.id)}
              className={`p-4 cursor-pointer transition-colors border-l-4 ${selectedRequest === req.id ? 'bg-brand-50 border-brand-600' : 'hover:bg-neutral-50 border-transparent'}`}>
              
                <div className="font-medium text-neutral-900 mb-1">
                  {req.county} County
                </div>
                <div className="text-xs text-neutral-500 mb-2">
                  {req.id} • {req.date}
                </div>
                <div className="text-sm text-neutral-600 mb-2">
                  {req.subCounties} sub-counties • {req.facilities} facilities
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-900">
                    Total: {req.totalQty} units
                  </span>
                  <StatusPill status={req.status as any} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[700px]">
          {selectedRequest ?
          <>
              <div className="p-6 border-b border-neutral-200 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">
                    {breakdown.county} County
                  </h2>
                  <div className="text-sm text-neutral-500 flex items-center">
                    <span className="font-mono mr-3">CTY-REQ-001</span>
                    <StatusPill status="Pending DHA" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-brand-200 text-brand-700 bg-brand-50 rounded-md text-sm font-medium hover:bg-brand-100">
                    Reject to County
                  </button>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
                    Approve & Route to Vendor
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wider">
                  County → Sub-County → Facility Breakdown
                </h3>

                {breakdown.subCounties.map((sc, idx) =>
              <div
                key={idx}
                className="mb-4 border border-neutral-200 rounded-lg overflow-hidden">
                
                    <button
                  onClick={() =>
                  setExpandedCounty(
                    expandedCounty === sc.name ? null : sc.name
                  )
                  }
                  className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  
                      <div className="flex items-center">
                        {expandedCounty === sc.name ?
                    <ChevronDown className="w-4 h-4 mr-2" /> :

                    <ChevronRight className="w-4 h-4 mr-2" />
                    }
                        <span className="font-medium text-neutral-900">
                          {sc.name} Sub-County
                        </span>
                      </div>
                      <span className="text-sm text-neutral-500">
                        {sc.facilities.length} facilities
                      </span>
                    </button>

                    {expandedCounty === sc.name &&
                <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
                          <tr>
                            <th className="px-4 py-3 font-medium">
                              Facility ID
                            </th>
                            <th className="px-4 py-3 font-medium">
                              Facility Name
                            </th>
                            <th className="px-4 py-3 font-medium">
                              Device Type
                            </th>
                            <th className="px-4 py-3 font-medium">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {sc.facilities.map((fac, fidx) =>
                    <tr key={fidx} className="hover:bg-neutral-50">
                              <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                                {fac.id}
                              </td>
                              <td className="px-4 py-3 text-neutral-900">
                                {fac.name}
                              </td>
                              <td className="px-4 py-3 text-neutral-600">
                                {fac.device}
                              </td>
                              <td className="px-4 py-3">
                                <input
                          type="number"
                          defaultValue={fac.qty}
                          className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm focus:ring-brand-500 focus:border-brand-500" />
                        
                              </td>
                            </tr>
                    )}
                        </tbody>
                      </table>
                }
                  </div>
              )}

                <div className="mt-6 p-4 bg-accent-50 border border-accent-100 rounded-lg">
                  <label className="block text-sm font-medium text-accent-900 mb-2">
                    Vendor Selection
                  </label>
                  <select className="w-full px-3 py-2 border border-accent-200 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm bg-white">
                    <option>HealthTech Solutions Ltd</option>
                    <option>MedEquip Kenya</option>
                    <option>Digital Health Supplies</option>
                  </select>
                </div>
              </div>
            </> :

          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Search className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select a county request to review.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}