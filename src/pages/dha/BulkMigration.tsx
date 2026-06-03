import React, { useRef, useState } from 'react';
import {
  Database,
  UploadCloud,
  FileDown,
  AlertCircle,
  CheckCircle2 } from
'lucide-react';
import { api } from '../../config/api';

type UploadState = 'idle' | 'validating' | 'results' | 'saving';

interface InventoryUploadRow {
  rowNumber: number;
  id: string;
  deviceType: string;
  imei: string | null;
  serial: string | null;
  status: string;
  dateReceived: string;
  facilityId: string | null;
}

interface ValidationError {
  row: number;
  message: string;
}

interface BulkSaveResponse {
  data: {
    savedCount: number;
    errorCount: number;
    errors: ValidationError[];
  };
}

const headers = [
  'id',
  'deviceType',
  'imei',
  'serial',
  'status',
  'dateReceived',
  'facilityId'
];

const validDeviceTypes = ['Tablet', 'Desktop', 'Laptop', 'Biometric'];
const validStatuses = [
  'Received',
  'Device Accepted',
  'Assigned',
  'Awaiting Support',
  'Under Repair',
  'Transferred',
  'Stolen',
  'Retired'
];

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }

  values.push(value.trim());
  return values;
};

export function BulkMigration() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState('');
  const [validRows, setValidRows] = useState<InventoryUploadRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [message, setMessage] = useState('');

  const downloadTemplate = () => {
    const csv = `${headers.join(',')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'dims_inventory_upload_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const validateRows = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const nextErrors: ValidationError[] = [];
    const nextRows: InventoryUploadRow[] = [];

    if (lines.length === 0) {
      return {
        rows: [],
        errors: [{ row: 1, message: 'CSV file is empty.' }]
      };
    }

    const uploadedHeaders = parseCsvLine(lines[0]);
    const missingHeaders = headers.filter((header) => !uploadedHeaders.includes(header));

    if (missingHeaders.length > 0) {
      return {
        rows: [],
        errors: [{ row: 1, message: `Missing header(s): ${missingHeaders.join(', ')}.` }]
      };
    }

    const seenIds = new Set<string>();
    const seenImeis = new Set<string>();
    const seenSerials = new Set<string>();

    lines.slice(1).forEach((line, index) => {
      const rowNumber = index + 2;
      const values = parseCsvLine(line);
      const raw = Object.fromEntries(
        uploadedHeaders.map((header, headerIndex) => [header, values[headerIndex] || ''])
      );
      const row: InventoryUploadRow = {
        rowNumber,
        id: raw.id,
        deviceType: raw.deviceType,
        imei: raw.imei || null,
        serial: raw.serial || null,
        status: raw.status || 'Device Accepted',
        dateReceived: raw.dateReceived || new Date().toISOString().slice(0, 10),
        facilityId: raw.facilityId || null
      };

      if (!row.id) {
        nextErrors.push({ row: rowNumber, message: 'id is required.' });
      } else if (seenIds.has(row.id)) {
        nextErrors.push({ row: rowNumber, message: `duplicate id ${row.id} in CSV.` });
      }

      if (!validDeviceTypes.includes(row.deviceType)) {
        nextErrors.push({
          row: rowNumber,
          message: `deviceType must be one of ${validDeviceTypes.join(', ')}.`
        });
      }

      if (!validStatuses.includes(row.status)) {
        nextErrors.push({
          row: rowNumber,
          message: `status must be one of ${validStatuses.join(', ')}.`
        });
      }

      if (!row.imei && !row.serial) {
        nextErrors.push({ row: rowNumber, message: 'imei or serial is required.' });
      }

      if (row.imei && seenImeis.has(row.imei)) {
        nextErrors.push({ row: rowNumber, message: `duplicate IMEI ${row.imei} in CSV.` });
      }

      if (row.serial && seenSerials.has(row.serial)) {
        nextErrors.push({ row: rowNumber, message: `duplicate serial ${row.serial} in CSV.` });
      }

      seenIds.add(row.id);

      if (row.imei) {
        seenImeis.add(row.imei);
      }

      if (row.serial) {
        seenSerials.add(row.serial);
      }

      if (!nextErrors.some((error) => error.row === rowNumber)) {
        nextRows.push(row);
      }
    });

    return {
      rows: nextRows,
      errors: nextErrors
    };
  };

  const handleFileSelected = async (file: File) => {
    setUploadState('validating');
    setFileName(file.name);
    setMessage('');

    try {
      const text = await file.text();
      const result = validateRows(text);

      setValidRows(result.rows);
      setErrors(result.errors);
      setUploadState('results');
    } catch {
      setValidRows([]);
      setErrors([{ row: 1, message: 'Unable to read CSV file.' }]);
      setUploadState('results');
    }
  };

  const commitRows = async () => {
    setUploadState('saving');
    setMessage('');

    try {
      const response = await api.post<BulkSaveResponse>('/inventory/bulk', {
        items: validRows
      });

      setErrors(response.data.errors);
      setValidRows([]);
      setMessage(`${response.data.savedCount} inventory rows saved successfully.`);
      setUploadState('results');
    } catch (saveError) {
      setErrors([
        {
          row: 0,
          message: saveError instanceof Error ? saveError.message : 'Unable to save inventory rows.'
        }
      ]);
      setUploadState('results');
    }
  };

  const resetUpload = () => {
    setUploadState('idle');
    setValidRows([]);
    setErrors([]);
    setFileName('');
    setMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              headers.
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
          <label className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-neutral-300 border-dashed rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-colors cursor-pointer group">
              <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleFileSelected(file);
                }
              }} />
              
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
            </label>
          }

          {uploadState === 'validating' &&
          <div className="py-12 flex flex-col items-center justify-center border-2 border-neutral-200 rounded-xl bg-neutral-50">
              <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-600 font-medium">
                Validating CSV rows against inventory rules...
              </p>
            </div>
          }

          {(uploadState === 'results' || uploadState === 'saving') &&
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-neutral-500 mr-2" />
                  <span className="font-medium text-neutral-900">
                    {fileName || 'Inventory upload'}
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  {validRows.length + errors.length} rows processed
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
                      {validRows.length}
                    </div>
                  </div>
                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                    <div className="flex items-center text-brand-700 mb-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="font-medium">Errors Found</span>
                    </div>
                    <div className="text-2xl font-bold text-brand-800">
                      {errors.length}
                    </div>
                  </div>
                </div>

                {message ?
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </div> :
                null}

                {errors.length > 0 ?
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
                          {errors.map((error, index) =>
                        <tr key={`${error.row}-${index}`}>
                              <td className="px-4 py-2 font-mono text-neutral-500">
                                {error.row || '-'}
                              </td>
                              <td className="px-4 py-2 text-brand-600">
                                {error.message}
                              </td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                  </div> :
                null}

                <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
                    
                    Upload Another CSV
                  </button>
                  <button
                    onClick={commitRows}
                    disabled={validRows.length === 0 || uploadState === 'saving'}
                    className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 disabled:opacity-60">
                    
                    {uploadState === 'saving' ? 'Saving...' : `Commit ${validRows.length} Valid Rows`}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);
}
