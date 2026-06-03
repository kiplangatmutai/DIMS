import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck } from
'lucide-react';
import { DEVICE_TYPES } from '../../data/referenceData';
import { api } from '../../config/api';
import { useRole } from '../../context/RoleContext';
interface RequisitionRow {
  id: string;
  sdpName: string;
  hrCount: number | '';
  deviceType: string;
  existingQty: number | '';
  requestedQty: number | '';
}
export function CreateRequisition() {
  const navigate = useNavigate();
  const { currentUser } = useRole();
  const [rows, setRows] = useState<RequisitionRow[]>([
  {
    id: '1',
    sdpName: '',
    hrCount: '',
    deviceType: '',
    existingQty: '',
    requestedQty: ''
  }]
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'entry' | 'review'>('entry');
  const addRow = () => {
    setRows([
    ...rows,
    {
      id: Math.random().toString(),
      sdpName: '',
      hrCount: '',
      deviceType: '',
      existingQty: '',
      requestedQty: ''
    }]
    );
  };
  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };
  const updateRow = (id: string, field: keyof RequisitionRow, value: any) => {
    setRows(
      rows.map((r) =>
      r.id === id ?
      {
        ...r,
        [field]: value
      } :
      r
      )
    );
  };
  const validateRows = () => {
    const invalidRow = rows.find(
      (row) =>
        !row.sdpName ||
        !row.hrCount ||
        !row.deviceType ||
        row.existingQty === '' ||
        !row.requestedQty
    );

    if (invalidRow) {
      throw new Error('Complete every row before continuing.');
    }
  };

  const saveRows = async (status: 'Draft' | 'Pending Sub-County') => {
    await Promise.all(
      rows.map((row) =>
        api.post('/requisitions', {
          sdpName: row.sdpName,
          hrCount: Number(row.hrCount),
          deviceType: row.deviceType,
          existingQty: Number(row.existingQty),
          requestedQty: Number(row.requestedQty),
          facilityId: currentUser?.facility?.id || currentUser?.facilityId || null,
          status
        })
      )
    );
  };

  const saveDraft = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      validateRows();
      await saveRows('Draft');
      navigate('/requisitions');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewRequisition = () => {
    setError('');

    try {
      validateRows();
      setStep('review');
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Unable to review requisition.');
    }
  };

  const submitRequisition = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      validateRows();
      await saveRows('Pending Sub-County');
      navigate('/requisitions');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit requisition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Main Form Area */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Create Requisition
          </h1>
          <p className="text-neutral-500 mt-1">
            Generate a demand request for service delivery points.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setStep('entry')}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${step === 'entry' ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:text-neutral-800'}`}>
            
            <Clock className="h-4 w-4" />
            Entry
          </button>
          <button
            type="button"
            onClick={reviewRequisition}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${step === 'review' ? 'bg-brand-50 text-brand-700' : 'text-neutral-500 hover:text-neutral-800'}`}>
            
            <CheckCircle2 className="h-4 w-4" />
            Review
          </button>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {step === 'entry' ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    Service Delivery Point
                  </th>
                  <th className="px-4 py-3 font-medium w-24">HR Count</th>
                  <th className="px-4 py-3 font-medium w-40">Device Type</th>
                  <th className="px-4 py-3 font-medium w-24">Existing</th>
                  <th className="px-4 py-3 font-medium w-24">Requested</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row) =>
                <tr key={row.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-2">
                      <input
                      type="text"
                      placeholder="Service delivery point name"
                      value={row.sdpName}
                      onChange={(e) =>
                      updateRow(row.id, 'sdpName', e.target.value)
                      }
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm" />
                    
                    </td>
                    <td className="px-4 py-2">
                      <input
                      type="number"
                      min="0"
                      value={row.hrCount}
                      onChange={(e) =>
                      updateRow(
                        row.id,
                        'hrCount',
                        parseInt(e.target.value) || ''
                      )
                      }
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm" />
                    
                    </td>
                    <td className="px-4 py-2">
                      <select
                      value={row.deviceType}
                      onChange={(e) =>
                      updateRow(row.id, 'deviceType', e.target.value)
                      }
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm bg-white">
                      
                        <option value="" disabled>
                          Select...
                        </option>
                        {DEVICE_TYPES.map((t) =>
                      <option key={t} value={t}>
                            {t}
                          </option>
                      )}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                      type="number"
                      min="0"
                      value={row.existingQty}
                      onChange={(e) =>
                      updateRow(
                        row.id,
                        'existingQty',
                        parseInt(e.target.value) || ''
                      )
                      }
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm" />
                    
                    </td>
                    <td className="px-4 py-2">
                      <input
                      type="number"
                      min="1"
                      value={row.requestedQty}
                      onChange={(e) =>
                      updateRow(
                        row.id,
                        'requestedQty',
                        parseInt(e.target.value) || ''
                      )
                      }
                      className="w-full px-3 py-1.5 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm font-medium text-brand-700" />
                    
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="p-1.5 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors disabled:opacity-50">
                      
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Service Delivery Point</th>
                  <th className="px-4 py-3 font-medium">HR Count</th>
                  <th className="px-4 py-3 font-medium">Device Type</th>
                  <th className="px-4 py-3 font-medium">Existing</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row) =>
                <tr key={row.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {row.sdpName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{row.hrCount}</td>
                    <td className="px-4 py-3 text-neutral-600">{row.deviceType}</td>
                    <td className="px-4 py-3 text-neutral-600">{row.existingQty}</td>
                    <td className="px-4 py-3 font-medium text-brand-700">
                      {row.requestedQty}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
          {step === 'entry' ? (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <button
              onClick={addRow}
              className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700">
              
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </button>
          </div>
          ) : null}
        </div>

        <div className="flex justify-end space-x-3">
          {error ? (
            <div className="mr-auto rounded-md border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
              {error}
            </div>
          ) : null}
          <button
            onClick={saveDraft}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-60">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
          {step === 'review' ? (
          <button
            onClick={() => setStep('entry')}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-60">
            
            Back to Edit
          </button>
          ) : null}
          <button
            onClick={step === 'review' ? submitRequisition : reviewRequisition}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm">
            
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : step === 'review' ? 'Submit Requisition' : 'Review Requisition'}
          </button>
        </div>
      </div>

      {/* Right Rail - Approval Chain Preview */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <h3 className="font-semibold text-neutral-900 mb-4 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-brand-600" />
            Approval Workflow
          </h3>

          <div className="relative border-l-2 border-neutral-200 ml-3 space-y-6 pb-2">
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              </div>
              <div className="font-medium text-sm text-neutral-900">
                Facility Submission
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                You are here
              </div>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-300" />
              <div className="font-medium text-sm text-neutral-500">
                Sub-County Review
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Aggregation & Validation
              </div>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-300" />
              <div className="font-medium text-sm text-neutral-500">
                County Approval
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Master Consolidation
              </div>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-300" />
              <div className="font-medium text-sm text-neutral-500">
                DHA Final Authorization
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Vendor Handoff
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent-50 rounded-xl border border-accent-100 p-5 text-sm text-accent-800">
          <h4 className="font-semibold mb-2 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Facility Details
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-accent-600">ID:</span>
              <span className="font-medium">{currentUser?.facility?.id || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-accent-600">County:</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-accent-600">Sub-County:</span>
              <span className="font-medium">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
