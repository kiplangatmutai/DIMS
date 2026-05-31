import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Boxes, ArrowRight, Activity } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function SubCountyDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Sub-County Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">Langata Sub-County Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Inbox className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">
              Pending Facility Requests
            </span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">12</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Activity className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">Orders in Transit</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">2</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Boxes className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Total Active Devices</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">1,240</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Action Required: Requests
            </h2>
            <button
              onClick={() => navigate('/requests')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
              
              Review Queue <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-neutral-100 flex-1">
            <div className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-neutral-900">
                  Mbagathi County Hospital
                </div>
                <StatusPill status="Pending Sub-County" />
              </div>
              <div className="text-sm text-neutral-500 flex justify-between">
                <span>3 Items • Total Qty: 15</span>
                <span>2 hrs ago</span>
              </div>
            </div>
            <div className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-neutral-900">
                  Langata Health Center
                </div>
                <StatusPill status="Pending Sub-County" />
              </div>
              <div className="text-sm text-neutral-500 flex justify-between">
                <span>1 Item • Total Qty: 2</span>
                <span>5 hrs ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Recent Deliveries
            </h2>
          </div>
          <div className="divide-y divide-neutral-100 flex-1 p-8 text-center text-neutral-500">
            No recent deliveries in the last 7 days.
          </div>
        </div>
      </div>
    </div>);

}