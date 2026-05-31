import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Building } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function RequisitionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const requisition = {
    id: 'REQ-2026-041',
    status: 'Pending Sub-County',
    items: [
    {
      sdp: 'Comprehensive Care Center',
      type: 'Tablet',
      requested: 10
    },
    {
      sdp: 'Maternity Wing',
      type: 'Desktop',
      requested: 3
    },
    {
      sdp: 'Outpatient Dept',
      type: 'Biometric',
      requested: 2
    }],

    timeline: [
    {
      stage: 'Facility Submission',
      status: 'completed',
      timestamp: '2026-05-26 09:14:22.104',
      actor: 'Jane Doe (Facility User)'
    },
    {
      stage: 'Sub-County Review',
      status: 'current',
      timestamp: null,
      actor: 'Pending'
    },
    {
      stage: 'County Approval',
      status: 'pending',
      timestamp: null,
      actor: 'Pending'
    },
    {
      stage: 'DHA Authorization',
      status: 'pending',
      timestamp: null,
      actor: 'Pending'
    }]

  };
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
            {requisition.id}
          </h1>
          <p className="text-neutral-500 mt-1">
            Requisition tracking and approval timeline.
          </p>
        </div>
        <StatusPill status={requisition.status as any} />
      </div>

      {/* Approval Chain Timeline */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <h2 className="font-semibold text-neutral-900 mb-6">Approval Chain</h2>
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200"></div>

          <div className="relative flex justify-between">
            {requisition.timeline.map((stage, idx) =>
            <div key={idx} className="flex flex-col items-center flex-1">
                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-3 ${stage.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : stage.status === 'current' ? 'bg-brand-600 border-brand-600 animate-pulse' : 'bg-neutral-100 border-neutral-300'}`}>
                
                  {stage.status === 'completed' &&
                <CheckCircle2 className="w-5 h-5 text-white" />
                }
                  {stage.status === 'current' &&
                <Clock className="w-5 h-5 text-white" />
                }
                  {stage.status === 'pending' &&
                <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
                }
                </div>
                <div
                className={`text-sm font-medium text-center mb-1 ${stage.status === 'current' ? 'text-brand-700' : 'text-neutral-900'}`}>
                
                  {stage.stage}
                </div>
                <div className="text-xs text-neutral-500 text-center mb-1">
                  {stage.actor}
                </div>
                {stage.timestamp &&
              <div className="text-xs font-mono text-neutral-400 bg-neutral-50 px-2 py-1 rounded">
                    {stage.timestamp}
                  </div>
              }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requisition Items */}
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
          <tbody className="divide-y divide-neutral-100">
            {requisition.items.map((item, idx) =>
            <tr key={idx} className="hover:bg-neutral-50">
                <td className="px-6 py-4 text-neutral-900">{item.sdp}</td>
                <td className="px-6 py-4 text-neutral-600">{item.type}</td>
                <td className="px-6 py-4 font-medium text-neutral-900">
                  {item.requested}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Facility Info */}
      <div className="bg-accent-50 rounded-xl border border-accent-100 p-5">
        <div className="flex items-center mb-3">
          <Building className="w-5 h-5 text-accent-600 mr-2" />
          <h3 className="font-semibold text-accent-900">Facility Details</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-accent-600">Facility ID</div>
            <div className="font-medium text-accent-900">HF-10293</div>
          </div>
          <div>
            <div className="text-accent-600">County</div>
            <div className="font-medium text-accent-900">Nairobi</div>
          </div>
          <div>
            <div className="text-accent-600">Sub-County</div>
            <div className="font-medium text-accent-900">Langata</div>
          </div>
        </div>
      </div>
    </div>);

}