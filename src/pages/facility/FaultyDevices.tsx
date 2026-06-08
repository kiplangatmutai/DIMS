import React, { useCallback, useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';
import { getFacilityScopeId } from '../../utils/facilityScope';

interface Ticket {
  id: string;
  deviceType: string;
  identifier: string;
  issue: string;
  status: string;
  date: string;
}

interface DataResponse<T> {
  data: T;
}

export function FaultyDevices() {
  const { currentUser } = useRole();
  const facilityId = getFacilityScopeId(currentUser);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0];

  const loadTickets = useCallback(async () => {
    if (!facilityId) {
      setTickets([]);
      setSelectedTicketId(null);
      return;
    }

    const response = await api.get<DataResponse<Ticket[]>>(
      `/maintenance-tickets?facilityId=${encodeURIComponent(facilityId)}`
    );
    setTickets(response.data);
    setSelectedTicketId((current) => current || response.data[0]?.id || null);
  }, [facilityId]);

  useEffect(() => {
    loadTickets().catch(() => setTickets([]));
  }, [loadTickets]);

  const createTicket = async () => {
    const deviceType = window.prompt('Device type');
    const identifier = window.prompt('IMEI or serial number');
    const issue = window.prompt('Issue description');

    if (!deviceType || !identifier || !issue) {
      return;
    }

    await api.post('/maintenance-tickets', {
      deviceType,
      identifier,
      issue,
      facilityId: facilityId || null
    });
    await loadTickets();
  };

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
        <button
          onClick={createTicket}
          className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
          
          <PlusCircle className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                {tickets.map((ticket) =>
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="hover:bg-neutral-50 cursor-pointer">
                    
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-900">{ticket.deviceType}</div>
                      <div className="text-xs text-neutral-500 font-mono">
                        {ticket.identifier}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 truncate max-w-[200px]">
                      {ticket.issue}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={ticket.status as any} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{ticket.date}</td>
                  </tr>
                )}
                {tickets.length === 0 ?
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                      No maintenance tickets found.
                    </td>
                  </tr> :
                null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex flex-col h-full">
          {selectedTicket ?
          <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-neutral-900">
                  {selectedTicket.id}
                </h3>
                <StatusPill status={selectedTicket.status as any} />
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <div className="text-sm text-neutral-500 mb-1">
                    Device Information
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                    <div className="font-medium text-neutral-900">
                      {selectedTicket.deviceType}
                    </div>
                    <div className="text-sm text-neutral-600 font-mono mt-1">
                      {selectedTicket.identifier}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-neutral-500 mb-1">
                    Issue Description
                  </div>
                  <div className="text-sm text-neutral-900 bg-neutral-50 p-3 rounded-md border border-neutral-200">
                    {selectedTicket.issue}
                  </div>
                </div>
              </div>
            </> :
          <div className="text-center text-neutral-500 py-12">
              Select a ticket to view details.
            </div>}
        </div>
      </div>
    </div>);
}
