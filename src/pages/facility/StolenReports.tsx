import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ShieldAlert, PlusCircle, FileText, MapPin } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';
import { getFacilityScopeId } from '../../utils/facilityScope';

interface Incident {
  id: string;
  deviceType: string;
  identifier: string;
  obNumber: string;
  status: 'Stolen' | 'Recovered';
  date: string;
  mdmLocked: boolean;
}

interface DataResponse<T> {
  data: T;
}

export function StolenReports() {
  const { currentUser } = useRole();
  const facilityId = getFacilityScopeId(currentUser);
  const [activeTab, setActiveTab] = useState<'Stolen' | 'Recovered'>('Stolen');
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const loadIncidents = useCallback(async () => {
    if (!facilityId) {
      setIncidents([]);
      return;
    }

    const response = await api.get<DataResponse<Incident[]>>(
      `/stolen-reports?facilityId=${encodeURIComponent(facilityId)}`
    );
    setIncidents(response.data);
  }, [facilityId]);

  useEffect(() => {
    loadIncidents().catch(() => setIncidents([]));
  }, [loadIncidents]);

  const filtered = useMemo(
    () => incidents.filter((incident) => incident.status === activeTab),
    [activeTab, incidents]
  );

  const createReport = async () => {
    const deviceType = window.prompt('Device type');
    const identifier = window.prompt('IMEI or serial number');
    const obNumber = window.prompt('Police OB number');

    if (!deviceType || !identifier || !obNumber) {
      return;
    }

    await api.post('/stolen-reports', {
      deviceType,
      identifier,
      obNumber,
      status: 'Stolen',
      mdmLocked: true,
      facilityId: facilityId || null
    });
    await loadIncidents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Security Incidents
          </h1>
          <p className="text-neutral-500 mt-1">
            Report and track stolen devices.
          </p>
        </div>
        <button
          onClick={createReport}
          className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
          
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
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Recovered' ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            
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
              {filtered.map((incident) =>
            <div
              key={incident.id}
              className="border border-neutral-200 rounded-lg p-5 hover:border-brand-300 transition-colors">
              
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1">
                        {incident.id} / {incident.date}
                      </div>
                      <h3 className="font-bold text-neutral-900">
                        {incident.deviceType}
                      </h3>
                      <div className="text-sm text-neutral-600 font-mono">
                        {incident.identifier}
                      </div>
                    </div>
                    <StatusPill status={incident.status as any} />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2 text-neutral-400" />
                      <span className="text-neutral-600">Police OB:</span>
                      <span className="ml-2 font-medium text-neutral-900">
                        {incident.obNumber}
                      </span>
                    </div>
                    {incident.mdmLocked ?
                <div className="flex items-center text-sm bg-brand-50 text-brand-700 p-2 rounded border border-brand-100">
                        <MapPin className="w-4 h-4 mr-2" />
                        MDM lockdown requested.
                      </div> :
                null}
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>
    </div>);
}
