import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { useRole } from '../../context/RoleContext';

export function RequisitionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useRole();
  const requisitionId = id || 'New Requisition';
  const timeline = [
  'Facility Submission',
  'Sub-County Review',
  'County Approval',
  'DHA Authorization'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/requisitions')}
        className="flex items-center text-sm text-neutral-600 hover:text-neutral-900">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to My Requests
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {requisitionId}
          </h1>
          <p className="text-neutral-500 mt-1">
            Requisition tracking and approval timeline.
          </p>
        </div>
        <StatusPill status="Draft" />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <h2 className="font-semibold text-neutral-900 mb-6">Approval Chain</h2>
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200"></div>

          <div className="relative flex justify-between">
            {timeline.map((stage) =>
            <div key={stage} className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 mb-3 bg-neutral-100 border-neutral-300">
                <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
              </div>
              <div className="text-sm font-medium text-center mb-1 text-neutral-900">
                {stage}
              </div>
              <div className="text-xs text-neutral-500 text-center mb-1">
                Pending
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="font-semibold text-neutral-900">Requested Items</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-medium">Service Delivery Point</th>
              <th className="px-6 py-4 font-medium">Device Type</th>
              <th className="px-6 py-4 font-medium">Requested Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-neutral-500">
                No requested items found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-accent-50 rounded-xl border border-accent-100 p-5">
        <div className="flex items-center mb-3">
          <Building className="w-5 h-5 text-accent-600 mr-2" />
          <h3 className="font-semibold text-accent-900">Facility Details</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-accent-600">Facility ID</div>
            <div className="font-medium text-accent-900">
              {currentUser?.facility?.id || '-'}
            </div>
          </div>
          <div>
            <div className="text-accent-600">Facility Name</div>
            <div className="font-medium text-accent-900">
              {currentUser?.facility?.name || '-'}
            </div>
          </div>
          <div>
            <div className="text-accent-600">Facility User</div>
            <div className="font-medium text-accent-900">
              {currentUser?.name || currentUser?.username || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>);

}
