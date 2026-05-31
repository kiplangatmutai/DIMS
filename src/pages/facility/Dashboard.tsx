import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Wrench,
  ShieldAlert,
  PlusCircle,
  ArrowRight } from
'lucide-react';
import { MOCK_INVENTORY, MOCK_REQUISITIONS } from '../../data/mockData';
import { StatusPill } from '../../components/ui/StatusPill';
export function FacilityDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Facility Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Mbagathi County Hospital (HF-10293)
          </p>
        </div>
        <button
          onClick={() => navigate('/requisitions/create')}
          className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
          
          <PlusCircle className="w-4 h-4 mr-2" />
          New Requisition
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <div className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Active Devices</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">142</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ClipboardList className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">Pending Requests</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">3</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Wrench className="w-5 h-5 mr-2 text-amber-500" />
            <span className="text-sm font-medium">Open Tickets</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">5</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2 text-brand-600" />
            <span className="text-sm font-medium">Stolen Incidents</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">1</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requisitions */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Recent Requisitions
            </h2>
            <button
              onClick={() => navigate('/requisitions')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
              
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-neutral-100 flex-1">
            {MOCK_REQUISITIONS.map((req) =>
            <div
              key={req.id}
              className="p-4 hover:bg-neutral-50 transition-colors">
              
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-neutral-900">{req.id}</div>
                  <StatusPill status={req.status as any} />
                </div>
                <div className="text-sm text-neutral-500 flex justify-between">
                  <span>
                    {req.deviceType} • Qty: {req.requestedQty}
                  </span>
                  <span>{req.timestamp.split(' ')[0]}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inventory Activity */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Inventory Alerts</h2>
            <button
              onClick={() => navigate('/inventory')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
              
              Go to Ledger <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-neutral-100 flex-1">
            {MOCK_INVENTORY.filter((i) => i.status !== 'Device Accepted').map(
              (inv) =>
              <div
                key={inv.id}
                className="p-4 hover:bg-neutral-50 transition-colors">
                
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-neutral-900">
                      {inv.deviceType}
                    </div>
                    <StatusPill status={inv.status as any} />
                  </div>
                  <div className="text-sm text-neutral-500 flex justify-between">
                    <span className="font-mono text-xs bg-neutral-100 px-1.5 py-0.5 rounded">
                      {inv.imei || inv.serial}
                    </span>
                    <span>Reported: {inv.dateReceived}</span>
                  </div>
                </div>

            )}
            {MOCK_INVENTORY.filter((i) => i.status !== 'Device Accepted').
            length === 0 &&
            <div className="p-8 text-center text-neutral-500">
                No active alerts.
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}