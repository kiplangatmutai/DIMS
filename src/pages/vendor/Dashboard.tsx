import React from 'react';
import { ShoppingCart, Barcode, CheckSquare, Ticket } from 'lucide-react';
export function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Vendor Operations Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">HealthTech Solutions Ltd.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ShoppingCart className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">New Orders</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">4</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Barcode className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">Pending Serialization</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">2</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <CheckSquare className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Ready for Dispatch</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">1</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Ticket className="w-5 h-5 mr-2 text-amber-500" />
            <span className="text-sm font-medium">Open Support Tickets</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">12</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Order Pipeline</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-neutral-900">
                    ORD-2026-003
                  </div>
                  <div className="text-sm text-neutral-500">
                    Kisumu County • 450 Units
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                  Awaiting Acceptance
                </span>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-neutral-900">
                    ORD-2026-001
                  </div>
                  <div className="text-sm text-neutral-500">
                    Nairobi County • 150 Units
                  </div>
                </div>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-xs font-medium border border-accent-200">
                  In Serialization
                </span>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-neutral-900">
                    ORD-2026-002
                  </div>
                  <div className="text-sm text-neutral-500">
                    Mombasa County • 45 Units
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                  Ready for Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Recent Support Tickets
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-neutral-900">
                  TKT-092 • Biometric Scanner
                </div>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium">
                  Awaiting Support
                </span>
              </div>
              <div className="text-sm text-neutral-600 truncate">
                Screen cracked, unresponsive to touch.
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Mbagathi Hospital • Reported 2 days ago
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-neutral-900">
                  TKT-081 • Tablet
                </div>
                <span className="text-xs text-accent-600 bg-accent-50 px-2 py-1 rounded font-medium">
                  In Progress
                </span>
              </div>
              <div className="text-sm text-neutral-600 truncate">
                Battery won't hold charge.
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Langata Health Center • Reported 5 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}