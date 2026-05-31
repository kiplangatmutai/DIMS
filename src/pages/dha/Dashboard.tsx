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
            National Overview & Operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Globe className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Total Active Inventory</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">124,592</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Pending Final Approvals</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">14</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2 text-brand-600" />
            <span className="text-sm font-medium">Theft Incidents (30d)</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">8</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Activity className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">MDM Active Devices</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">124,100</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Vendor Orders in Flight
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-neutral-900">
                    ORD-2026-001 • Nairobi County
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-accent-50 text-accent-700 rounded-full border border-accent-200">
                    Processing
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-accent-500 h-2 rounded-full"
                    style={{
                      width: '60%'
                    }}>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 text-right">
                  Warehouse Serialization
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-neutral-900">
                    ORD-2026-002 • Mombasa County
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                    Dispatched
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full"
                    style={{
                      width: '90%'
                    }}>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 text-right">
                  Awaiting County PoD
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">System Alerts</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="p-4 flex items-start">
              <ShieldAlert className="w-5 h-5 text-brand-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  MDM Lockdown Triggered
                </div>
                <div className="text-sm text-neutral-600 mt-0.5">
                  Device LT-88219B reported stolen at Mbagathi Hospital. MDM
                  lockdown successful.
                </div>
                <div className="text-xs text-neutral-400 mt-1">10 mins ago</div>
              </div>
            </div>
            <div className="p-4 flex items-start">
              <Activity className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  High Fault Rate Detected
                </div>
                <div className="text-sm text-neutral-600 mt-0.5">
                  Biometric scanners in Kisumu County showing 15% fault rate
                  this month.
                </div>
                <div className="text-xs text-neutral-400 mt-1">2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}