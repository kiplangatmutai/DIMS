import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, Inbox, Search, X } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';

interface Requisition {
  id: string;
  sdpName: string;
  deviceType: string;
  requestedQty: number;
  approvedQty?: number;
  status: string;
  timestamp: string;
  facilityId?: string | null;
  facilityName?: string | null;
  county?: string | null;
  subCounty?: string | null;
}

interface DataResponse<T> {
  data: T;
}

export function FacilityRequests() {
  const { currentUser } = useRole();
  const [requests, setRequests] = useState<Requisition[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [approvedQty, setApprovedQty] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadRequests = async () => {
    const response = await api.get<DataResponse<Requisition[]>>(
      '/requisitions?status=Pending%20Sub-County'
    );
    setRequests(response.data);
    setSelectedRequestId((current) =>
      current && response.data.some((request) => request.id === current) ? current : null
    );
  };

  useEffect(() => {
    loadRequests().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load facility requests.');
    });
  }, []);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return requests;

    return requests.filter((request) =>
      [request.id, request.sdpName, request.facilityName, request.facilityId, request.deviceType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [requests, searchTerm]);

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) || null;

  const selectRequest = (request: Requisition) => {
    setSelectedRequestId(request.id);
    setApprovedQty(request.approvedQty ?? request.requestedQty);
    setError('');
    setMessage('');
  };

  const updateRequest = async (updates: Record<string, unknown>, successMessage: string) => {
    if (!selectedRequest) return;

    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      await api.patch(`/requisitions/${selectedRequest.id}`, updates);
      setMessage(successMessage);
      setShowRejectModal(false);
      setRejectionReason('');
      await loadRequests();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update request.');
    } finally {
      setIsSaving(false);
    }
  };

  const approveRequest = () => {
    if (!selectedRequest || approvedQty < 0) {
      setError('Approved quantity must be zero or greater.');
      return;
    }

    updateRequest(
      {
        approvedQty,
        status: 'Pending County',
        subCountyApprovedByUserId: currentUser?.id || null,
        subCountyApprovedAt: new Date().toISOString()
      },
      'Request approved and routed to County review.'
    );
  };

  const rejectRequest = () => {
    if (!rejectionReason.trim()) {
      setError('Enter a rejection reason.');
      return;
    }

    updateRequest(
      {
        status: 'Rejected',
        rejectionReason: rejectionReason.trim(),
        subCountyApprovedByUserId: currentUser?.id || null,
        subCountyApprovedAt: new Date().toISOString()
      },
      'Request rejected.'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Facility Requests Queue</h1>
        <p className="text-neutral-500 mt-1">
          Requests mapped to {currentUser?.subCounty || 'your sub-county'},{' '}
          {currentUser?.county || 'your county'}.
        </p>
      </div>

      {error ? <div className="rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">{error}</div> : null}
      {message ? <div className="rounded-md border border-accent-200 bg-accent-50 p-3 text-sm text-black">{message}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search facility or request..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-100">
            {filteredRequests.map((request) => (
              <button
                type="button"
                key={request.id}
                onClick={() => selectRequest(request)}
                className={`block w-full p-4 text-left transition-colors border-l-4 ${selectedRequestId === request.id ? 'bg-brand-50 border-brand-600' : 'hover:bg-neutral-50 border-transparent'}`}>
                <div className="font-medium text-neutral-900 mb-1">
                  {request.facilityName || request.sdpName}
                </div>
                <div className="text-xs text-neutral-500 mb-2">
                  {request.id} / {new Date(request.timestamp).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm text-neutral-600">{request.requestedQty} requested</span>
                  <StatusPill status={request.status as any} />
                </div>
              </button>
            ))}
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">No mapped facility requests pending review.</div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[600px]">
          {selectedRequest ? (
            <>
              <div className="p-6 border-b border-neutral-200 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedRequest.facilityName || selectedRequest.sdpName}</h2>
                  <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
                    <span className="font-mono">{selectedRequest.id}</span>
                    <StatusPill status={selectedRequest.status as any} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRejectModal(true)} className="inline-flex items-center px-4 py-2 border border-brand-200 text-brand-700 bg-brand-50 rounded-md text-sm font-medium hover:bg-brand-100">
                    <X className="mr-2 h-4 w-4" /> Reject
                  </button>
                  <button disabled={isSaving} onClick={approveRequest} className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 disabled:opacity-60">
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="bg-accent-50 border border-accent-100 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 text-accent-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-accent-800">
                    Approval routes this request to County review. Only requests matching your assigned county and sub-county appear here.
                  </div>
                </div>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div><dt className="text-neutral-500">County / Sub-County</dt><dd className="font-medium text-neutral-900">{selectedRequest.county} / {selectedRequest.subCounty}</dd></div>
                  <div><dt className="text-neutral-500">Facility ID</dt><dd className="font-medium text-neutral-900">{selectedRequest.facilityId || '-'}</dd></div>
                  <div><dt className="text-neutral-500">Service Delivery Point</dt><dd className="font-medium text-neutral-900">{selectedRequest.sdpName}</dd></div>
                  <div><dt className="text-neutral-500">Device Type</dt><dd className="font-medium text-neutral-900">{selectedRequest.deviceType}</dd></div>
                  <div><dt className="text-neutral-500">Requested Quantity</dt><dd className="font-medium text-neutral-900">{selectedRequest.requestedQty}</dd></div>
                  <div>
                    <dt className="text-neutral-500">Approved Quantity</dt>
                    <dd className="mt-1">
                      <input type="number" min="0" value={approvedQty} onChange={(event) => setApprovedQty(Number(event.target.value))} className="w-28 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500" />
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Inbox className="w-12 h-12 mb-4 text-neutral-300" />
              <p>Select a request from the queue to review.</p>
            </div>
          )}
        </div>
      </div>

      {showRejectModal ? (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Reject Request</h3>
            <textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="w-full border border-neutral-300 rounded-md p-3 text-sm focus:ring-brand-500 focus:border-brand-500 mb-4" rows={4} placeholder="Mandatory rejection remarks..." />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">Cancel</button>
              <button disabled={isSaving} onClick={rejectRequest} className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 disabled:opacity-60">Confirm Rejection</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
