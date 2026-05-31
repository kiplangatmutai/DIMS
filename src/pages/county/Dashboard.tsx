import React from 'react';
import { Truck, Boxes, Users, AlertTriangle } from 'lucide-react';
export function CountyDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            County Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">Nairobi County Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Truck className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Inbound Deliveries</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">3</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Boxes className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Total Inventory</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">14,205</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            <span className="text-sm font-medium">Active Incidents</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">28</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Users className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">Active Users</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">342</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Sub-County Health
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">Langata</span>
                  <span className="text-neutral-500">1,240 Devices</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full"
                    style={{
                      width: '45%'
                    }}>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">
                    Kamukunji
                  </span>
                  <span className="text-neutral-500">890 Devices</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full"
                    style={{
                      width: '30%'
                    }}>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">
                    Westlands
                  </span>
                  <span className="text-neutral-500">2,100 Devices</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full"
                    style={{
                      width: '75%'
                    }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="p-4 text-sm">
              <span className="font-medium text-neutral-900">
                Transfer TKT-001
              </span>{' '}
              approved from Langata to Kamukunji.
              <div className="text-neutral-500 text-xs mt-1">2 hours ago</div>
            </div>
            <div className="p-4 text-sm">
              <span className="font-medium text-neutral-900">
                Consignment ORD-2026-001
              </span>{' '}
              dispatched by Vendor.
              <div className="text-neutral-500 text-xs mt-1">5 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}