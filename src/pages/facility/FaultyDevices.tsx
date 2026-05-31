import React from 'react';
import { Wrench, PlusCircle } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function FaultyDevices() {
  // Mock tickets
  const tickets = [
  {
    id: 'TKT-092',
    deviceType: 'Biometric',
    identifier: 'BIO-4492X',
    issue: 'Screen cracked, unresponsive to touch.',
    status: 'Awaiting Support',
    date: '2026-05-25'
  },
  {
    id: 'TKT-081',
    deviceType: 'Tablet',
    identifier: '354920108472910',
    issue: "Battery won't hold charge.",
    status: 'In Progress',
    date: '2026-05-20'
  },
  {
    id: 'TKT-045',
    deviceType: 'Desktop',
    identifier: 'SN-1120B',
    issue: 'Motherboard failure.',
    status: 'Replaced',
    date: '2026-04-10'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Faulty Devices
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage maintenance tickets and replacements.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Ticket ID</th>
                  <th className="px-6 py-4 font-medium">Device</th>
                  <th className="px-6 py-4 font-medium">Issue Summary</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tickets.map((t) =>
                <tr key={t.id} className="hover:bg-neutral-50 cursor-pointer">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {t.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-900">{t.deviceType}</div>
                      <div className="text-xs text-neutral-500 font-mono">
                        {t.identifier}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 truncate max-w-[200px]">
                      {t.issue}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={t.status as any} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{t.date}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Detail Panel (Mocking selection of the first ticket) */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-neutral-900">TKT-092</h3>
            <StatusPill status="Awaiting Support" />
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <div className="text-sm text-neutral-500 mb-1">
                Device Information
              </div>
              <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                <div className="font-medium text-neutral-900">
                  Biometric Scanner
                </div>
                <div className="text-sm text-neutral-600 font-mono mt-1">
                  Serial: BIO-4492X
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-500 mb-1">
                Issue Description
              </div>
              <div className="text-sm text-neutral-900 bg-neutral-50 p-3 rounded-md border border-neutral-200">
                Screen cracked, unresponsive to touch. Happened during patient
                intake.
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-500 mb-2">
                Lifecycle Timeline
              </div>
              <div className="relative border-l-2 border-neutral-200 ml-2 space-y-4 pb-2">
                <div className="relative pl-4">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                  <div className="font-medium text-sm text-neutral-900">
                    Awaiting Support
                  </div>
                  <div className="text-xs text-neutral-500">
                    2026-05-25 09:12 AM
                  </div>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-300" />
                  <div className="font-medium text-sm text-neutral-500">
                    In Progress
                  </div>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-300" />
                  <div className="font-medium text-sm text-neutral-500">
                    Resolved / Replaced
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}