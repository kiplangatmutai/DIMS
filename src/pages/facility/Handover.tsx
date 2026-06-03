import React, { useState } from 'react';
import { FileCheck, UploadCloud, CheckCircle2 } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
import { api } from '../../config/api';
export function Handover() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formType, setFormType] = useState<'S11' | 'S13'>('S11');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Unable to read voucher file.'));
      reader.readAsDataURL(file);
    });

  const submitHandover = async () => {
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (!isConfirmed) {
        throw new Error('Confirm physical receipt before accepting inventory.');
      }

      if (!selectedFile) {
        throw new Error('Upload a signed S11 or S13 voucher.');
      }

      const fileContent = await readFileAsDataUrl(selectedFile);

      await api.post('/handovers', {
        consignmentId: 'ORD-2026-001',
        formType,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileContent,
        confirmed: true
      });

      setMessage('S11/S13 voucher uploaded and consignment accepted.');
      setSelectedFile(null);
      setIsConfirmed(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit handover.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          S11/S13 Handover
        </h1>
        <p className="text-neutral-500 mt-1">
          Accept incoming consignments into facility inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Deliveries */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-900">
              Pending Acceptance
            </h2>
          </div>
          <div className="p-5">
            <div className="border border-brand-200 bg-brand-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-brand-900">
                  Consignment: ORD-2026-001
                </h3>
                <StatusPill status="Pending Facility Acceptance" />
              </div>
              <p className="text-sm text-brand-700 mb-3">
                Arrived at facility today. Requires physical validation and
                S11/S13 voucher upload.
              </p>

              <div className="bg-white rounded border border-brand-100 p-3 text-sm">
                <div className="font-medium text-neutral-900 mb-2">
                  Manifest Summary:
                </div>
                <ul className="space-y-1 text-neutral-600">
                  <li className="flex justify-between">
                    <span>Tablets</span>{' '}
                    <span className="font-medium">10 Units</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Desktops</span>{' '}
                    <span className="font-medium">2 Units</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Empty State for others */}
            <div className="text-center py-8 text-neutral-400 border-2 border-dashed border-neutral-200 rounded-lg">
              No other pending deliveries.
            </div>
          </div>
        </div>

        {/* Acceptance Form */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <h2 className="font-semibold text-neutral-900 mb-6 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-brand-600" />
            Validate & Accept: ORD-2026-001
          </h2>

          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(event) => setIsConfirmed(event.target.checked)}
                  className="w-5 h-5 text-brand-600 rounded border-neutral-300 focus:ring-brand-500" />
                
                <span className="text-sm font-medium text-neutral-900">
                  I confirm physical receipt of 12 devices matching the digital
                  manifest.
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Voucher Type
              </label>
              <select
                value={formType}
                onChange={(event) => setFormType(event.target.value as 'S11' | 'S13')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:ring-brand-500 focus:border-brand-500">
                
                <option value="S11">S11</option>
                <option value="S13">S13</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Upload Signed Voucher
              </label>
              <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="sr-only"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
                
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-neutral-400 group-hover:text-brand-500 transition-colors" />
                  <div className="flex text-sm text-neutral-600 justify-center">
                    <span className="relative rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {selectedFile ? selectedFile.name : 'PDF, PNG, JPG up to 10MB'}
                  </p>
                </div>
              </label>
            </div>

            {(message || error) ?
            <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {error || message}
              </div> :
            null}

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={submitHandover}
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-60">
                
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Confirm Acceptance to Inventory'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
