import React, { useState } from 'react';
import {
  Database,
  UploadCloud,
  FileDown,
  AlertCircle,
  CheckCircle2 } from
'lucide-react';
export function BulkMigration() {
  const [uploadState, setUploadState] = useState<
    'idle' | 'validating' | 'results'>(
    'idle');
  const handleUpload = () => {
    setUploadState('validating');
    setTimeout(() => setUploadState('results'), 1500);
  };
  const downloadTemplate = () => {
    const headers = [
      'id',
      'deviceType',
      'imei',
      'serial',
      'status',
      'dateReceived',
      'facilityId'
    ];
    const csv = `${headers.join(',')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'dims_inventory_upload_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Bulk Data Migration
        </h1>
        <p className="text-neutral-500 mt-1">
          Upload CSV templates to backfill historical device allocations.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              1. Download Template
            </h2>
            <p className="text-sm text-neutral-600 max-w-xl">
              Use the strict system-validated CSV template. Do not modify the
              headers. Ensure all Facility IDs and Device Types match the system
              master lists exactly.
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors">
            
            <FileDown className="w-4 h-4 mr-2" />
            Download CSV Template
          </button>
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            2. Upload Data
          </h2>

          {uploadState === 'idle' &&
          <div
            onClick={handleUpload}
            className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-neutral-300 border-dashed rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-colors cursor-pointer group">
            
              <div className="space-y-2 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-neutral-400 group-hover:text-brand-500 transition-colors" />
                <div className="flex text-sm text-neutral-600 justify-center">
                  <span className="relative rounded-md font-medium text-brand-600 hover:text-brand-500">
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500">
                  CSV files only, up to 50MB
                </p>
              </div>
            </div>
          }

          {uploadState === 'validating' &&
          <div className="py-12 flex flex-col items-center justify-center border-2 border-neutral-200 rounded-xl bg-neutral-50">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-600 font-medium">
                Validating 14,205 rows against master registries...
              </p>
            </div>
          }

          {uploadState === 'results' &&
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-neutral-500 mr-2" />
                  <span className="font-medium text-neutral-900">
                    historical_inventory_q1.csv
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  14,205 rows processed
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center text-emerald-700 mb-1">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span className="font-medium">Valid Rows</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-800">
                      14,198
                    </div>
                  </div>
                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                    <div className="flex items-center text-brand-700 mb-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="font-medium">Errors Found</span>
                    </div>
                    <div className="text-2xl font-bold text-brand-800">7</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                    Validation Errors
                  </h3>
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-4 py-2 font-medium text-neutral-600">
                            Row
                          </th>
                          <th className="px-4 py-2 font-medium text-neutral-600">
                            Error Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        <tr>
                          <td className="px-4 py-2 font-mono text-neutral-500">
                            42
                          </td>
                          <td className="px-4 py-2 text-brand-600">
                            Invalid Facility ID: 'HF-99999' not found in
                            registry.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-neutral-500">
                            105
                          </td>
                          <td className="px-4 py-2 text-brand-600">
                            Duplicate IMEI: '354920108472910' already exists in
                            system.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Please fix these errors in your CSV and re-upload, or
                    proceed to commit only the valid rows.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                  <button
                  onClick={() => setUploadState('idle')}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
                  
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
                    Commit 14,198 Valid Rows
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}
