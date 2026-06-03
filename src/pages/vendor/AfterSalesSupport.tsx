import React, { useState } from 'react';
import { Ticket, AlertCircle } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
type TicketStatus =
'Awaiting Support' |
'In Progress' |
'Picked' |
'Resolved' |
'Returned' |
'Replaced';
export function AfterSalesSupport() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketStatus, setTicketStatus] =
  useState<TicketStatus>('Awaiting Support');
  const [replacementIdentifier, setReplacementIdentifier] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const tickets: any[] = [];

  const handleStatusChange = (newStatus: TicketStatus) => {
    setTicketStatus(newStatus);
    if (newStatus !== 'Replaced') {
      setShowValidationError(false);
    }
  };
  const handleApprove = () => {
    if (ticketStatus === 'Replaced' && !replacementIdentifier.trim()) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    alert(
      'Ticket updated. Old identifier archived, new identifier activated in facility inventory.'
    );
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          After Sales Support
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage faulty device tickets and replacements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">Incoming Tickets</h2>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
            {tickets.map((ticket) =>
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket.id)}
              className={`p-4 cursor-pointer transition-colors border-l-4 ${selectedTicket === ticket.id ? 'bg-brand-50 border-brand-600' : 'hover:bg-neutral-50 border-transparent'}`}>
              
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-neutral-900">
                    {ticket.id}
                  </div>
                  <StatusPill status={ticket.status as any} />
                </div>
                <div className="text-sm text-neutral-600 mb-1">
                  {ticket.device}
                </div>
                <div className="text-xs text-neutral-500">
                  {ticket.facility}
                </div>
              </div>
            )}
            {tickets.length === 0 ?
            <div className="p-8 text-center text-neutral-500">
                No incoming tickets found.
              </div> :
            null}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
          {selectedTicket ?
          <>
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">
                      {selectedTicket}
                    </h2>
                    <div className="text-sm text-neutral-500">
                      -
                    </div>
                  </div>
                  <StatusPill status={ticketStatus as any} />
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <div className="text-sm text-neutral-500 mb-1">
                    Device Information
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                    <div className="font-medium text-neutral-900">
                      -
                    </div>
                    <div className="text-sm text-neutral-600 font-mono mt-1">
                      Serial: -
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-neutral-500 mb-1">
                    Issue Description
                  </div>
                  <div className="text-sm text-neutral-900 bg-neutral-50 p-3 rounded-md border border-neutral-200">
                    No issue selected.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Update Status
                  </label>
                  <select
                  value={ticketStatus}
                  onChange={(e) =>
                  handleStatusChange(e.target.value as TicketStatus)
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm">
                  
                    <option value="Awaiting Support">Awaiting Support</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Picked">Picked</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Returned">Returned</option>
                    <option value="Replaced">Replaced</option>
                  </select>
                </div>

                {ticketStatus === 'Replaced' &&
              <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Replaced IMEI / Serial No{' '}
                      <span className="text-brand-600">*</span>
                    </label>
                    <input
                  type="text"
                  value={replacementIdentifier}
                  onChange={(e) => {
                    setReplacementIdentifier(e.target.value);
                    if (e.target.value.trim()) setShowValidationError(false);
                  }}
                  placeholder="Enter new device identifier"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm font-mono ${showValidationError ? 'border-brand-500 bg-brand-50' : 'border-neutral-300'}`} />
                
                    {showValidationError &&
                <div className="flex items-center mt-2 text-sm text-brand-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        This field is required when status is 'Replaced'.
                      </div>
                }
                  </div>
              }
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
                <button
                onClick={handleApprove}
                className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
                
                  Update Ticket
                </button>
              </div>
            </> :

          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Ticket className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select a ticket to manage.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}
