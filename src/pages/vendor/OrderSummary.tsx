import React, { useState } from 'react';
import { Search, Eye, CheckCircle2, ShoppingCart } from 'lucide-react';
export function OrderSummary() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const orders = [
  {
    id: 'ORD-2026-003',
    county: 'Kisumu',
    type: 'Mixed',
    qty: 450,
    timestamp: '2026-05-27 09:15:00',
    status: 'Pending Acceptance'
  },
  {
    id: 'ORD-2026-004',
    county: 'Nakuru',
    type: 'Tablet',
    qty: 120,
    timestamp: '2026-05-27 11:30:00',
    status: 'Pending Acceptance'
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Order Summary</h1>
        <p className="text-neutral-500 mt-1">
          Review and accept approved DHA orders.
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
                placeholder="Search orders..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
              
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
            {orders.map((order) =>
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order.id)}
              className={`p-4 cursor-pointer transition-colors border-l-4 ${selectedOrder === order.id ? 'bg-brand-50 border-brand-600' : 'hover:bg-neutral-50 border-transparent'}`}>
              
                <div className="font-medium text-neutral-900 mb-1">
                  {order.id}
                </div>
                <div className="text-sm text-neutral-600 mb-2">
                  {order.county} County • {order.qty} Units
                </div>
                <div className="text-xs text-neutral-500">
                  {order.timestamp}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
          {selectedOrder ?
          <>
              <div className="p-6 border-b border-neutral-200 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">
                    {selectedOrder}
                  </h2>
                  <div className="text-sm text-neutral-500">Kisumu County</div>
                </div>
                <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept Order
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wider">
                  Detailed Breakdown
                </h3>

                <table className="w-full text-sm text-left border border-neutral-200 rounded-lg overflow-hidden">
                  <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Facility ID</th>
                      <th className="px-4 py-3 font-medium">Facility Name</th>
                      <th className="px-4 py-3 font-medium">Device Type</th>
                      <th className="px-4 py-3 font-medium text-center">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono text-neutral-500">
                        HF-30481
                      </td>
                      <td className="px-4 py-3 text-neutral-900">
                        Jaramogi Oginga Odinga Teaching
                      </td>
                      <td className="px-4 py-3 text-neutral-600">Tablet</td>
                      <td className="px-4 py-3 text-center font-medium text-neutral-900">
                        200
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono text-neutral-500">
                        HF-30481
                      </td>
                      <td className="px-4 py-3 text-neutral-900">
                        Jaramogi Oginga Odinga Teaching
                      </td>
                      <td className="px-4 py-3 text-neutral-600">Desktop</td>
                      <td className="px-4 py-3 text-center font-medium text-neutral-900">
                        50
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono text-neutral-500">
                        HF-30482
                      </td>
                      <td className="px-4 py-3 text-neutral-900">
                        Lumumba Sub-County Hospital
                      </td>
                      <td className="px-4 py-3 text-neutral-600">Tablet</td>
                      <td className="px-4 py-3 text-center font-medium text-neutral-900">
                        200
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </> :

          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <ShoppingCart className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select an order to view details and accept.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}