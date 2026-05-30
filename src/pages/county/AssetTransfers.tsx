import React from 'react';
import { ArrowRightLeft, PlusCircle } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function AssetTransfers() {
  const transfers = [
  {
    id: 'TRF-001',
    from: 'Mbagathi Hospital',
    to: 'Pumwani Maternity',
    device: 'Tablet',
    qty: 5,
    status: 'Approved',
    date: '2026-05-20'
  },
  {
    id: 'TRF-002',
    from: 'Langata Health Center',
    to: 'Mbagathi Hospital',
    device: 'Desktop',
    qty: 1,
    status: 'Pending County',
    date: '2026-05-25'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Asset Transfers
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage intra-county device reallocations.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Transfer Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Origin Facility</th>
                <th className="px-6 py-4 font-medium">Destination Facility</th>
                <th className="px-6 py-4 font-medium">Device Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transfers.map((trf) =>
              <tr key={trf.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {trf.id}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{trf.from}</td>
                  <td className="px-6 py-4 text-neutral-600 flex items-center">
                    <ArrowRightLeft className="w-3 h-3 mx-2 text-neutral-400" />
                    {trf.to}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {trf.qty}x {trf.device}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={trf.status as any} />
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{trf.date}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}