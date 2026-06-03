import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusPill } from '../../components/ui/StatusPill';
import { api } from '../../config/api';

interface Requisition {
  id: string;
  sdpName: string;
  deviceType: string;
  requestedQty: number;
  status: string;
  timestamp: string;
}

interface DataResponse<T> {
  data: T;
}

export function MyRequests() {
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);

  useEffect(() => {
    api.get<DataResponse<Requisition[]>>('/requisitions')
      .then((response) => setRequisitions(response.data))
      .catch(() => setRequisitions([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Requests</h1>
        <p className="text-neutral-500 mt-1">
          Track the status of your facility's device requisitions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Tracking No. or SDP..."
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
            
          </div>
          <button className="flex items-center px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Tracking No.</th>
                <th className="px-6 py-4 font-medium">
                  Service Delivery Point
                </th>
                <th className="px-6 py-4 font-medium">Device Type</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {requisitions.map((req) =>
              <tr
                key={req.id}
                className="hover:bg-neutral-50 transition-colors group">
                
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {req.id}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{req.sdpName}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {req.deviceType}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {req.requestedQty}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={req.status as any} />
                  </td>
                  <td className="px-6 py-4 text-neutral-500 font-mono text-xs">
                    {req.timestamp}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                    onClick={() => navigate(`/requisitions/${req.id}`)}
                    className="text-brand-600 hover:text-brand-800 font-medium text-sm flex items-center justify-end w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              )}
              {requisitions.length === 0 ?
              <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-neutral-500">
                    No requisitions recorded yet.
                  </td>
                </tr> :
              null}
            </tbody>
          </table>
        </div>

        {/* Pagination (Mock) */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            Showing {requisitions.length} entries
          </span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-neutral-300 rounded bg-white text-neutral-400 cursor-not-allowed text-sm">
              Prev
            </button>
            <button className="px-3 py-1 border border-brand-500 rounded bg-brand-50 text-brand-700 font-medium text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-neutral-300 rounded bg-white text-neutral-400 cursor-not-allowed text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>);

}
