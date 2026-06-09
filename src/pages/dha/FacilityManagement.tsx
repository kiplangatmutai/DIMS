import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, CheckCircle2, FileDown, Plus, Search, UploadCloud, XCircle } from 'lucide-react';
import { api } from '../../config/api';

interface Facility {
  id: string;
  name: string;
  county: string;
  status?: string;
}

interface UploadRow extends Facility {
  rowNumber: number;
}

interface ValidationError {
  row: number;
  message: string;
}

interface DataResponse<T> {
  data: T;
}

interface BulkResponse {
  data: {
    savedCount: number;
    errors: ValidationError[];
  };
}

const headers = ['Facility ID', 'Facility Name', 'County'];

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

export function FacilityManagement() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [form, setForm] = useState({ id: '', name: '', county: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([]);
  const [uploadErrors, setUploadErrors] = useState<ValidationError[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadFacilities = async () => {
    const response = await api.get<DataResponse<Facility[]>>('/facilities');
    setFacilities(response.data);
  };

  useEffect(() => {
    Promise.all([
      loadFacilities(),
      api.get<DataResponse<string[]>>('/counties').then((response) => setCounties(response.data))
    ]).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load facility management.');
    });
  }, []);

  const filteredFacilities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return facilities;
    return facilities.filter((facility) =>
      [facility.id, facility.name, facility.county].some((value) => value.toLowerCase().includes(term))
    );
  }, [facilities, searchTerm]);

  const createFacility = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      await api.post('/facilities', form);
      setForm({ id: '', name: '', county: '' });
      setMessage('Facility added successfully.');
      await loadFacilities();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to add facility.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([`${headers.join(',')}\n`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dims_facilities_upload_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file: File) => {
    const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim());
    const errors: ValidationError[] = [];
    const rows: UploadRow[] = [];

    if (lines.length === 0) {
      setUploadRows([]);
      setUploadErrors([{ row: 1, message: 'CSV file is empty.' }]);
      return;
    }

    const uploadedHeaders = parseCsvLine(lines[0]);
    const missingHeaders = headers.filter((header) => !uploadedHeaders.includes(header));
    if (missingHeaders.length > 0) {
      setUploadRows([]);
      setUploadErrors([{ row: 1, message: `Missing header(s): ${missingHeaders.join(', ')}.` }]);
      return;
    }

    const seenIds = new Set<string>();
    lines.slice(1).forEach((line, index) => {
      const rowNumber = index + 2;
      const values = parseCsvLine(line);
      const raw = Object.fromEntries(uploadedHeaders.map((header, position) => [header, values[position] || '']));
      const row = { rowNumber, id: raw['Facility ID'], name: raw['Facility Name'], county: raw.County };

      if (!row.id) errors.push({ row: rowNumber, message: 'Facility ID is required.' });
      else if (seenIds.has(row.id.toLowerCase())) errors.push({ row: rowNumber, message: `Duplicate Facility ID ${row.id} in CSV.` });
      if (!row.name) errors.push({ row: rowNumber, message: 'Facility Name is required.' });
      if (!counties.includes(row.county)) errors.push({ row: rowNumber, message: 'County must match an available onboarding county.' });
      seenIds.add(row.id.toLowerCase());
      if (!errors.some((item) => item.row === rowNumber)) rows.push(row);
    });

    setUploadRows(rows);
    setUploadErrors(errors);
    setMessage('');
  };

  const commitUpload = async () => {
    setIsSaving(true);
    setError('');
    try {
      const response = await api.post<BulkResponse>('/facilities/bulk', { items: uploadRows });
      setUploadErrors(response.data.errors);
      setUploadRows([]);
      setMessage(`${response.data.savedCount} facilities uploaded successfully.`);
      await loadFacilities();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to upload facilities.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Facility Management</h1>
        <p className="mt-1 text-neutral-500">Add facilities individually or upload the facility register using CSV.</p>
      </div>

      {message ? <div className="rounded-md border border-accent-200 bg-accent-50 p-3 text-sm text-black">{message}</div> : null}
      {error ? <div className="rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">{error}</div> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={createFacility} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-neutral-900"><Plus className="mr-2 h-5 w-5 text-brand-600" />Add Facility</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700">Facility ID
              <input required value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
            </label>
            <label className="text-sm font-medium text-neutral-700">Facility Name
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
            </label>
            <label className="text-sm font-medium text-neutral-700 md:col-span-2">County
              <select required value={form.county} onChange={(event) => setForm({ ...form, county: event.target.value })} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="">Select county</option>
                {counties.map((county) => <option key={county} value={county}>{county}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-5 flex justify-end">
            <button disabled={isSaving} className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"><Plus className="mr-2 h-4 w-4" />Add Facility</button>
          </div>
        </form>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center text-lg font-semibold text-neutral-900"><UploadCloud className="mr-2 h-5 w-5 text-brand-600" />Bulk Upload</h2>
            <button onClick={downloadTemplate} className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"><FileDown className="mr-2 h-4 w-4" />CSV Template</button>
          </div>
          <label className="flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-neutral-300 px-6 py-8 hover:border-brand-500 hover:bg-brand-50">
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
            <span className="text-center text-sm text-neutral-600"><UploadCloud className="mx-auto mb-2 h-8 w-8 text-neutral-400" />Select facilities CSV</span>
          </label>
          {(uploadRows.length > 0 || uploadErrors.length > 0) ? (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-accent-200 p-3"><CheckCircle2 className="mr-1 inline h-4 w-4" />{uploadRows.length} valid</div>
                <div className="rounded-md border border-brand-200 bg-brand-50 p-3"><XCircle className="mr-1 inline h-4 w-4" />{uploadErrors.length} errors</div>
              </div>
              {uploadErrors.map((item, index) => <div key={`${item.row}-${index}`} className="text-sm text-brand-700">Row {item.row}: {item.message}</div>)}
              <div className="flex justify-end">
                <button disabled={!uploadRows.length || isSaving} onClick={commitUpload} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">Upload {uploadRows.length} Facilities</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50 p-4">
          <div>
            <h2 className="font-semibold text-neutral-900">Facility Register</h2>
            <p className="text-xs text-neutral-500">{facilities.length} facilities</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search facility or county..." className="w-full rounded-md border border-neutral-300 py-2 pl-10 pr-3 text-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500"><tr><th className="px-6 py-4">Facility ID</th><th className="px-6 py-4">Facility Name</th><th className="px-6 py-4">County</th><th className="px-6 py-4">Status</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFacilities.map((facility) => <tr key={facility.id} className="hover:bg-neutral-50"><td className="px-6 py-4 font-mono text-xs text-neutral-700">{facility.id}</td><td className="px-6 py-4 font-medium text-neutral-900"><Building2 className="mr-2 inline h-4 w-4 text-brand-500" />{facility.name}</td><td className="px-6 py-4 text-neutral-600">{facility.county}</td><td className="px-6 py-4 text-neutral-600">{facility.status || 'Active'}</td></tr>)}
              {!filteredFacilities.length ? <tr><td colSpan={4} className="px-6 py-10 text-center text-neutral-500">No facilities recorded yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
