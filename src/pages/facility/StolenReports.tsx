import React, { useState } from 'react';
import { ShieldAlert, PlusCircle, FileText, MapPin } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { MDMPanel } from '../../components/mdm/MDMPanel';
export function StolenReports() {
  const [activeTab, setActiveTab] = useState<'Stolen' | 'Recovered'>('Stolen');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(
    'INC-2026-012'
  );
  const incidents = [
  {
    id: 'INC-2026-012',
    deviceType: 'Laptop',
    identifier: 'LT-88219B',
    obNumber: 'OB/12/01/2026',
    status: 'Stolen',
    date: '2026-01-20',
    mdmLocked: true
  },
  {
    id: 'INC-2025-088',
    deviceType: 'Tablet',
    identifier: '354920108471111',
    obNumber: 'OB/44/11/2025',
    status: 'Recovered',
    date: '2025-11-05',
    mdmLocked: false
  }];

  const filtered = incidents.filter((i) => i.status === activeTab);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Security Incidents
          </h1>
          <p className="text-neutral-500 mt-1">
            Report and track stolen devices. MDM lockdown is triggered
            automatically.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Report Stolen Device
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4">
          <button
            onClick={() => setActiveTab('Stolen')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Stolen' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            Active Investigations
          </button>
          <button
            onClick={() => setActiveTab('Recovered')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Recovered' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
            Recovered Devices
          </button>
        </div>

        <div className="p-6">
          {filtered.length === 0 ?
          <div className="text-center py-12 text-neutral-500">
              <ShieldAlert className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
              <p>No {activeTab.toLowerCase()} devices found.</p>
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((inc) =>
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc.id)}
              className="border border-neutral-200 rounded-lg p-5 hover:border-brand-300 transition-colors cursor-pointer">
              
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">
                        {inc.id} • {inc.date}
                      </div>
                      <h3 className="font-bold text-neutral-900">
                        {inc.deviceType}
                      </h3>
                      <div className="text-sm text-neutral-600 font-mono">
                        {inc.identifier}
                      </div>
                    </div>
                    <StatusPill status={inc.status as any} />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2 text-neutral-400" />
                      <span className="text-neutral-600">Police OB:</span>
                      <span className="ml-2 font-medium text-neutral-900">
                        {inc.obNumber}
                      </span>
                    </div>
                    {inc.mdmLocked &&
                <div className="flex items-center text-sm bg-brand-50 text-brand-700 p-2 rounded border border-brand-100">
                        <MapPin className="w-4 h-4 mr-2" />
                        MDM Lockdown Active. GPS tracking enabled.
                      </div>
                }
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex space-x-3">
                    <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                      View Police Report
                    </button>
                    <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                      View Facility Report
                    </button>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>

      {/* MDM Integration Panel for Selected Stolen Device */}
      {selectedIncident && activeTab === 'Stolen' &&
      <div className="mt-6">
          <MDMPanel
          deviceId="LT-88219B"
          deviceType="Laptop"
          lockStatus="locked"
          lastSeen="2026-05-27 14:30:00"
          lastKnownLocation={{
            lat: -1.2921,
            lng: 36.8219,
            address: 'Mbagathi Road, Nairobi'
          }} />
        
        </div>
      }
    </div>);

}