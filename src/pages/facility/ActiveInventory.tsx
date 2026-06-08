import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Filter, Wrench, ShieldAlert } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';
import { getFacilityScopeId } from '../../utils/facilityScope';

interface InventoryItem {
  id: string;
  deviceType: string;
  imei: string | null;
  serial: string | null;
  status: string;
  dateReceived: string;
  facilityId: string | null;
}

interface DataResponse<T> {
  data: T;
}

export function ActiveInventory() {
  const { currentUser } = useRole();
  const facilityId = getFacilityScopeId(currentUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [message, setMessage] = useState('');

  const loadInventory = useCallback(async () => {
    if (!facilityId) {
      setInventory([]);
      return;
    }

    const response = await api.get<DataResponse<InventoryItem[]>>(
      `/inventory?facilityId=${encodeURIComponent(facilityId)}`
    );
    setInventory(response.data);
  }, [facilityId]);

  useEffect(() => {
    loadInventory().catch(() => setInventory([]));
  }, [loadInventory]);

  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return inventory;
    }

    return inventory.filter((item) =>
      [item.deviceType, item.imei, item.serial, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [inventory, searchTerm]);

  const reportFaulty = async (item: InventoryItem) => {
    const issue = window.prompt('Describe the device fault');

    if (!issue) {
      return;
    }

    await api.post('/maintenance-tickets', {
      deviceType: item.deviceType,
      identifier: item.imei || item.serial,
      issue,
      facilityId: item.facilityId
    });
    await api.patch(`/inventory/${item.id}`, { status: 'Awaiting Support' });
    setMessage('Faulty device ticket created.');
    await loadInventory();
  };

  const reportStolen = async (item: InventoryItem) => {
    const obNumber = window.prompt('Enter police OB number');

    if (!obNumber) {
      return;
    }

    await api.post('/stolen-reports', {
      deviceType: item.deviceType,
      identifier: item.imei || item.serial,
      obNumber,
      facilityId: item.facilityId
    });
    await api.patch(`/inventory/${item.id}`, { status: 'Stolen' });
    setMessage('Stolen device report created.');
    await loadInventory();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Active Inventory
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage and track devices currently assigned to this facility.
        </p>
      </div>
      {message ? (
        <div className="rounded-md border border-brand-200 bg-white px-4 py-3 text-sm text-black">
          {message}
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search IMEI or Serial Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
            
          </div>
          <button className="flex items-center px-3 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Type
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-medium">Device Type</th>
                <th className="px-6 py-4 font-medium">IMEI 1</th>
                <th className="px-6 py-4 font-medium">Serial No</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Received</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredInventory.map((inv) =>
              <tr
                key={inv.id}
                className="hover:bg-neutral-50 transition-colors group">
                
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {inv.deviceType}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs">
                    {inv.imei || '-'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-mono text-xs">
                    {inv.serial || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={inv.status as any} />
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {inv.dateReceived}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                      onClick={() => reportFaulty(inv)}
                      className="text-brand-600 hover:text-brand-800 font-medium text-xs flex items-center bg-brand-50 px-2 py-1 rounded"
                      disabled={inv.status !== 'Device Accepted'}>
                      
                        <Wrench className="w-3 h-3 mr-1" />
                        Report Faulty
                      </button>
                      <button
                      onClick={() => reportStolen(inv)}
                      className="text-brand-600 hover:text-brand-800 font-medium text-xs flex items-center bg-brand-50 px-2 py-1 rounded"
                      disabled={inv.status !== 'Device Accepted'}>
                      
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Report Stolen
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {filteredInventory.length === 0 ?
              <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                    No inventory records yet.
                  </td>
                </tr> :
              null}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}
