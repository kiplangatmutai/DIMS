import React, { useState } from 'react';
import { Truck, UploadCloud, CheckCircle2, FileText } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function ProofOfDelivery() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const orders = [
  {
    id: 'ORD-2026-001',
    vendor: 'HealthTech Solutions',
    items: 150,
    status: 'Dispatched',
    date: '2026-05-26'
  },
  {
    id: 'ORD-2026-002',
    vendor: 'MedEquip Ltd',
    items: 45,
    status: 'Dispatched',
    date: '2026-05-25'
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Proof of Delivery (PoD)
        </h1>
        <p className="text-neutral-500 mt-1">
          Cross-check physical hardware against digital manifests and upload
          PoD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbound Deliveries */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Inbound Consignments
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
            {orders.map((order) =>
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order.id)}
              className={`p-4 cursor-pointer transition-colors border-l-4 ${selectedOrder === order.id ? 'bg-brand-50 border-brand-600' : 'hover:bg-neutral-50 border-transparent'}`}>
              
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-neutral-900">{order.id}</div>
                  <StatusPill status={order.status as any} />
                </div>
                <div className="text-sm text-neutral-600 mb-1">
                  {order.vendor}
                </div>
                <div className="text-xs text-neutral-500">
                  Dispatched: {order.date} • {order.items} Units
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PoD Upload Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
          {selectedOrder ?
          <div className="flex flex-col h-full">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">
                      {selectedOrder}
                    </h2>
                    <div className="text-sm text-neutral-500">
                      Vendor: HealthTech Solutions
                    </div>
                  </div>
                  <StatusPill status="Dispatched" />
                </div>

                <div className="bg-accent-50 border border-accent-100 rounded-lg p-4 flex items-start">
                  <Truck className="w-5 h-5 text-accent-600 mr-3 mt-0.5" />
                  <div className="text-sm text-accent-800">
                    This consignment contains 150 units destined for 12
                    facilities. Uploading the PoD will transition all units to
                    'Pending Facility Acceptance'.
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                    Digital Manifest Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-neutral-200 rounded-lg p-3">
                      <div className="text-neutral-500 text-sm mb-1">
                        Tablets
                      </div>
                      <div className="text-xl font-bold text-neutral-900">
                        120
                      </div>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-3">
                      <div className="text-neutral-500 text-sm mb-1">
                        Desktops
                      </div>
                      <div className="text-xl font-bold text-neutral-900">
                        30
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-1" /> View Full
                    Serialization List
                  </button>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Upload Scanned Proof of Delivery (PoD)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors cursor-pointer group">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-neutral-400 group-hover:text-brand-500 transition-colors" />
                      <div className="flex text-sm text-neutral-600 justify-center">
                        <span className="relative rounded-md font-medium text-brand-600 hover:text-brand-500">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-neutral-500">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
                <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm County Receipt
                </button>
              </div>
            </div> :

          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Truck className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select a consignment to process PoD.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}