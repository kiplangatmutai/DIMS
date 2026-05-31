import React, { useState } from 'react';
import { Search, CheckCircle2, X, Send } from 'lucide-react';
export function DispatchReview() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const orders = [
  {
    id: 'ORD-2026-001',
    county: 'Nairobi',
    units: 12,
    submittedBy: 'Warehouse Team A',
    date: '2026-05-27 10:15:00'
  }];

  const serialization = [
  {
    county: 'Nairobi',
    facilityId: 'HF-10293',
    facilityName: 'Mbagathi Hospital',
    deviceType: 'Tablet',
    qty: 10,
    imei: '354920108472910',
    serial: null
  },
  {
    county: 'Nairobi',
    facilityId: 'HF-10293',
    facilityName: 'Mbagathi Hospital',
    deviceType: 'Desktop',
    qty: 2,
    imei: null,
    serial: 'SN-99201A'
  }];

  const handleApproveDispatch = () => {
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 5000);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dispatch Review</h1>
        <p className="text-neutral-500 mt-1">
          Verify warehouse serialization and approve dispatch.
        </p>
      </div>

      {showSuccessBanner &&
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-emerald-900">
              Dispatch Approved Successfully
            </div>
            <div className="text-sm text-emerald-700 mt-1">
              Webhook notification sent to DHA. SMS alerts dispatched to County
              Request Approver. Order status updated to 'Dispatched'.
            </div>
          </div>
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Pending Review</h2>
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
                  {order.county} County • {order.units} Units
                </div>
                <div className="text-xs text-neutral-500">
                  Submitted by {order.submittedBy}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {order.date}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
          {selectedOrder ?
          <>
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-1">
                  {selectedOrder}
                </h2>
                <div className="text-sm text-neutral-500">
                  Warehouse Serialization Matrix
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left border border-neutral-200 rounded-lg overflow-hidden">
                  <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">County</th>
                      <th className="px-4 py-3 font-medium">Facility ID</th>
                      <th className="px-4 py-3 font-medium">Facility Name</th>
                      <th className="px-4 py-3 font-medium">Device Type</th>
                      <th className="px-4 py-3 font-medium">Qty</th>
                      <th className="px-4 py-3 font-medium">IMEI 1</th>
                      <th className="px-4 py-3 font-medium">Serial No</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {serialization.map((item, idx) =>
                  <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 text-neutral-900">
                          {item.county}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                          {item.facilityId}
                        </td>
                        <td className="px-4 py-3 text-neutral-900">
                          {item.facilityName}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {item.deviceType}
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-900">
                          {item.qty}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                          {item.imei || '-'}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                          {item.serial || '-'}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end space-x-3">
                <button className="flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
                  <X className="w-4 h-4 mr-2" />
                  Send Back to Warehouse
                </button>
                <button
                onClick={handleApproveDispatch}
                className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
                
                  <Send className="w-4 h-4 mr-2" />
                  Approve Dispatch
                </button>
              </div>
            </> :

          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <CheckCircle2 className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select an order to review serialization.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}