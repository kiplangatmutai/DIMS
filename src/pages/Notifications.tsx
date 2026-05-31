import React from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
export function Notifications() {
  const notifications = [
  {
    id: 1,
    title: 'Order ORD-2026-001 Dispatched',
    message:
    'Vendor HealthTech Solutions has dispatched the consignment. Awaiting County PoD.',
    timestamp: '2026-05-27 14:20:00.104',
    type: 'info',
    read: false
  },
  {
    id: 2,
    title: 'MDM Lockdown Triggered',
    message:
    'Device LT-88219B reported stolen at Mbagathi Hospital. MDM lockdown successful.',
    timestamp: '2026-05-27 10:15:22.891',
    type: 'alert',
    read: false
  },
  {
    id: 3,
    title: 'Requisition REQ-2026-041 Approved',
    message: 'Sub-County has approved and merged your requisition.',
    timestamp: '2026-05-26 09:14:22.104',
    type: 'success',
    read: true
  }];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Notifications Center
          </h1>
          <p className="text-neutral-500 mt-1">
            System alerts and SLA-tracked events.
          </p>
        </div>
        <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {notifications.map((notif) =>
          <div
            key={notif.id}
            className={`p-5 flex items-start transition-colors ${notif.read ? 'bg-white' : 'bg-brand-50/30'}`}>
            
              <div className="mr-4 mt-1">
                {notif.type === 'info' &&
              <Bell className="w-5 h-5 text-accent-500" />
              }
                {notif.type === 'alert' &&
              <AlertCircle className="w-5 h-5 text-brand-600" />
              }
                {notif.type === 'success' &&
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              }
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3
                  className={`text-sm font-medium ${notif.read ? 'text-neutral-900' : 'text-brand-900'}`}>
                  
                    {notif.title}
                  </h3>
                  <div className="flex items-center text-xs text-neutral-500 font-mono bg-neutral-100 px-2 py-1 rounded">
                    <Clock className="w-3 h-3 mr-1" />
                    {notif.timestamp}
                  </div>
                </div>
                <p className="text-sm text-neutral-600">{notif.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}