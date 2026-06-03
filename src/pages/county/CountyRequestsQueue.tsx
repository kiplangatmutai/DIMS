import React, { useState } from 'react';
import { Search, Filter, Inbox } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function CountyRequestsQueue() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const requests: any[] = [];

  const detailItems: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Sub-County Requests Queue
        </h1>
        <p className="text-neutral-500 mt-1">
          Review and consolidate Sub-County orders into master County request.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search sub-county..."
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
                  {req.subCounty} Sub-County
                </div>
                <div className="text-xs text-neutral-500 mb-2">
                  {req.id} • {req.date}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">
                    {req.facilities} facilities ({req.totalQty} qty)
                  </span>
                  <StatusPill status={req.status as any} />
                </div>
              </div>
            )}
            {requests.length === 0 ?
            <div className="p-8 text-center text-neutral-500">
                No Sub-County requests found.
              </div> :
            null}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
          {selectedRequest ?
          <>
              <div className="p-6 border-b border-neutral-200 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">
                    Selected Sub-County
                  </h2>
                  <div className="text-sm text-neutral-500 flex items-center">
                    <span className="font-mono mr-3">{selectedRequest}</span>
                    <StatusPill status="Pending County" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-brand-200 text-brand-700 bg-brand-50 rounded-md text-sm font-medium hover:bg-brand-100">
                    Reject Request
                  </button>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
                    Approve & Consolidate
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left border border-neutral-200 rounded-lg overflow-hidden">
                  <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Facility</th>
                      <th className="px-4 py-3 font-medium">Device Type</th>
                      <th className="px-4 py-3 font-medium text-center">
                        Requested
                      </th>
                      <th className="px-4 py-3 font-medium">Approved Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {detailItems.map((item, idx) =>
                  <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 text-neutral-900">
                          {item.facility}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {item.type}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-neutral-900">
                          {item.requested}
                        </td>
                        <td className="px-4 py-3">
                          <input
                        type="number"
                        defaultValue={item.approved}
                        className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm focus:ring-brand-500 focus:border-brand-500" />
                      
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </> :

          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Inbox className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select a Sub-County request to review.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}
