import React, { useState } from 'react';
import { Barcode, Save, Send } from 'lucide-react';
export function Serialization() {
  const [items, setItems] = useState([
  {
    id: 1,
    facility: 'Mbagathi Hospital',
    type: 'Tablet',
    identifier: ''
  },
  {
    id: 2,
    facility: 'Mbagathi Hospital',
    type: 'Tablet',
    identifier: ''
  },
  {
    id: 3,
    facility: 'Mbagathi Hospital',
    type: 'Desktop',
    identifier: ''
  }]
  );
  const updateIdentifier = (id: number, value: string) => {
    setItems(
      items.map((item) =>
      item.id === id ?
      {
        ...item,
        identifier: value
      } :
      item
      )
    );
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Warehouse Serialization
          </h1>
          <p className="text-neutral-500 mt-1">
            Map physical hardware identifiers to ORD-2026-001.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
            <Send className="w-4 h-4 mr-2" />
            Submit to Service Delivery
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
          <div className="flex items-center text-sm text-neutral-600">
            <Barcode className="w-4 h-4 mr-2" />
            Scan or type identifiers. Tablets require IMEI, others require
            Serial No.
          </div>
          <div className="text-sm font-medium text-neutral-900">
            {items.filter((i) => i.identifier).length} / {items.length} Mapped
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-500 uppercase bg-white border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-medium w-16">#</th>
              <th className="px-6 py-4 font-medium">Facility</th>
              <th className="px-6 py-4 font-medium">Device Type</th>
              <th className="px-6 py-4 font-medium">Identifier Type</th>
              <th className="px-6 py-4 font-medium">Value (IMEI / Serial)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item, idx) =>
            <tr key={item.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 text-neutral-500">{idx + 1}</td>
                <td className="px-6 py-4 text-neutral-900">{item.facility}</td>
                <td className="px-6 py-4 text-neutral-600">{item.type}</td>
                <td className="px-6 py-4 text-neutral-500 text-xs">
                  {item.type === 'Tablet' ? 'IMEI 1' : 'Serial No'}
                </td>
                <td className="px-6 py-4">
                  <input
                  type="text"
                  value={item.identifier}
                  onChange={(e) => updateIdentifier(item.id, e.target.value)}
                  placeholder={
                  item.type === 'Tablet' ?
                  'Enter 15-digit IMEI' :
                  'Enter Serial No'
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm font-mono" />
                
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}