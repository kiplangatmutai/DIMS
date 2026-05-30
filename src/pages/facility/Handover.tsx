import React from 'react';
import { FileCheck, UploadCloud, CheckCircle2 } from 'lucide-react';
import { StatusPill } from '../../components/ui/StatusPill';
export function Handover() {
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
                  className="w-5 h-5 text-brand-600 rounded border-neutral-300 focus:ring-brand-500" />
                
                <span className="text-sm font-medium text-neutral-900">
                  I confirm physical receipt of 12 devices matching the digital
                  manifest.
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Upload Signed S11/S13 Voucher
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-neutral-400 group-hover:text-brand-500 transition-colors" />
                  <div className="flex text-sm text-neutral-600 justify-center">
                    <span className="relative rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirm Acceptance to Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}