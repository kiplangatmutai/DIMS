import React, { useState } from 'react';
import { ArrowRightLeft, ShieldAlert, Wrench, Download } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function Incidents() {
  const [activeTab, setActiveTab] = useState<
    'Transfers' | 'Theft' | 'Maintenance'>(
    'Transfers');
  const transfers: any[] = [];

  const thefts: any[] = [];

  const maintenance: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Incidents & Maintenance
          </h1>
          <p className="text-neutral-500 mt-1">
            Nationwide asset tracking and incident management.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
          <Download className="w-4 h-4 mr-2" />
          Export Current Tab
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4">
          <button
            onClick={() => setActiveTab('Transfers')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'Transfers' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Asset Transfers
          </button>
          <button
            onClick={() => setActiveTab('Theft')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'Theft' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            <ShieldAlert className="w-4 h-4 mr-2" />
            Theft Incidents
          </button>
          <button
            onClick={() => setActiveTab('Maintenance')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'Maintenance' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            <Wrench className="w-4 h-4 mr-2" />
            Maintenance
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'Transfers' &&
          <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Transfer ID</th>
                  <th className="px-6 py-4 font-medium">Origin County</th>
                  <th className="px-6 py-4 font-medium">Destination County</th>
                  <th className="px-6 py-4 font-medium">Facility</th>
                  <th className="px-6 py-4 font-medium">Device</th>
                  <th className="px-6 py-4 font-medium">Qty</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transfers.map((t) =>
              <tr key={t.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {t.id}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {t.originCounty}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {t.destCounty}
                    </td>
                    <td className="px-6 py-4 text-neutral-900">{t.facility}</td>
                    <td className="px-6 py-4 text-neutral-600">{t.device}</td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {t.qty}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={t.status as any} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{t.date}</td>
                  </tr>
              )}
                {transfers.length === 0 ?
                <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-neutral-500">
                      No transfer records found.
                    </td>
                  </tr> :
                null}
              </tbody>
            </table>
          }

          {activeTab === 'Theft' &&
          <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Incident ID</th>
                  <th className="px-6 py-4 font-medium">County</th>
                  <th className="px-6 py-4 font-medium">Facility</th>
                  <th className="px-6 py-4 font-medium">Device</th>
                  <th className="px-6 py-4 font-medium">Identifier</th>
                  <th className="px-6 py-4 font-medium">OB Number</th>
                  <th className="px-6 py-4 font-medium">MDM Status</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {thefts.map((t) =>
              <tr key={t.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {t.id}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{t.county}</td>
                    <td className="px-6 py-4 text-neutral-900">{t.facility}</td>
                    <td className="px-6 py-4 text-neutral-600">{t.device}</td>
                    <td className="px-6 py-4 font-mono text-xs text-neutral-600">
                      {t.identifier}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{t.obNumber}</td>
                    <td className="px-6 py-4">
                      {t.mdmLocked ?
                  <span className="text-xs font-medium px-2 py-1 bg-brand-50 text-brand-700 rounded border border-brand-200">
                          Locked
                        </span> :

                  <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                          Inactive
                        </span>
                  }
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={t.status as any} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{t.date}</td>
                  </tr>
              )}
                {thefts.length === 0 ?
                <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-neutral-500">
                      No theft incidents found.
                    </td>
                  </tr> :
                null}
              </tbody>
            </table>
          }

          {activeTab === 'Maintenance' &&
          <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-medium">County</th>
                  <th className="px-6 py-4 font-medium">Total Faulty</th>
                  <th className="px-6 py-4 font-medium">In Progress</th>
                  <th className="px-6 py-4 font-medium">Replaced</th>
                  <th className="px-6 py-4 font-medium">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {maintenance.map((m, idx) =>
              <tr key={idx} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {m.county}
                    </td>
                    <td className="px-6 py-4 text-neutral-900 font-semibold">
                      {m.totalFaulty}
                    </td>
                    <td className="px-6 py-4 text-accent-600 font-medium">
                      {m.inProgress}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">
                      {m.replaced}
                    </td>
                    <td className="px-6 py-4 text-amber-600 font-medium">
                      {m.pending}
                    </td>
                  </tr>
              )}
                {maintenance.length === 0 ?
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                      No maintenance summary records found.
                    </td>
                  </tr> :
                null}
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>);

}
