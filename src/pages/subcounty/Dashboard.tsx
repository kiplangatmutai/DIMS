import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Boxes, Inbox } from 'lucide-react';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';

interface Requisition {
  id: string;
  facilityName?: string | null;
  sdpName: string;
  deviceType: string;
  requestedQty: number;
}

interface InventoryItem {
  id: string;
  status: string;
}

interface DataResponse<T> {
  data: T;
}

export function SubCountyDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useRole();
  const [requests, setRequests] = useState<Requisition[]>([]);
  const [activeDevices, setActiveDevices] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<DataResponse<Requisition[]>>('/requisitions?status=Pending%20Sub-County'),
      api.get<DataResponse<InventoryItem[]>>('/inventory')
    ])
      .then(([requestResponse, inventoryResponse]) => {
        setRequests(requestResponse.data);
        setActiveDevices(
          inventoryResponse.data.filter((item) => item.status === 'Device Accepted').length
        );
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard.');
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Sub-County Dashboard</h1>
          <p className="text-neutral-500 mt-1">
            {currentUser?.subCounty || 'Assigned sub-county'}, {currentUser?.county || 'assigned county'} overview.
          </p>
        </div>
      </div>

      {error ? <div className="rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">{error}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigate('/requests')} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col text-left hover:border-brand-300">
          <div className="flex items-center text-neutral-500 mb-2">
            <Inbox className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Pending Facility Requests</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{requests.length}</div>
        </button>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Activity className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">Orders in Transit</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <button onClick={() => navigate('/inventory')} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col text-left hover:border-brand-300">
          <div className="flex items-center text-neutral-500 mb-2">
            <Boxes className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Total Active Devices</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{activeDevices}</div>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h2 className="font-semibold text-neutral-900">Action Required: Requests</h2>
          <button onClick={() => navigate('/requests')} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
            Review Queue <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        {requests.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {requests.slice(0, 5).map((request) => (
              <button key={request.id} onClick={() => navigate('/requests')} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-neutral-50">
                <div>
                  <div className="font-medium text-neutral-900">{request.facilityName || request.sdpName}</div>
                  <div className="text-xs text-neutral-500">{request.id} / {request.deviceType}</div>
                </div>
                <div className="text-sm font-medium text-neutral-900">{request.requestedQty} requested</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500">No mapped facility requests pending review.</div>
        )}
      </div>
    </div>
  );
}
