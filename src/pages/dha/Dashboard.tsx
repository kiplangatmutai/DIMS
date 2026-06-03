import React from 'react';
import { Globe, ShieldAlert, CheckCircle, Activity } from 'lucide-react';

export function DHADashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            DHA Central Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            National overview and operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Globe className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Total Active Inventory</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Pending Final Approvals</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2 text-brand-600" />
            <span className="text-sm font-medium">Theft Incidents (30d)</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Activity className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">MDM Active Devices</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Vendor Orders in Flight
            </h2>
          </div>
          <div className="p-8 text-center text-neutral-500">
            No vendor orders in flight.
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">System Alerts</h2>
          </div>
          <div className="p-8 text-center text-neutral-500">
            No system alerts yet.
          </div>
        </div>
      </div>
    </div>
  );
}
