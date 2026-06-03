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
          <p className="text-neutral-500 mt-1">Vendor operations overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ShoppingCart className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">New Orders</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Barcode className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">Pending Serialization</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <CheckSquare className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Ready for Dispatch</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Ticket className="w-5 h-5 mr-2 text-amber-500" />
            <span className="text-sm font-medium">Open Support Tickets</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Order Pipeline</h2>
          </div>
          <div className="p-8 text-center text-neutral-500">
            No orders in the pipeline.
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Recent Support Tickets
            </h2>
          </div>
          <div className="p-8 text-center text-neutral-500">
            No recent support tickets.
          </div>
        </div>
      </div>
    </div>
  );
}
