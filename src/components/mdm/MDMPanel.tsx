import React from 'react';
import { MapPin, Lock, Activity, AlertTriangle } from 'lucide-react';
interface MDMPanelProps {
  deviceId: string;
  deviceType: string;
  lastKnownLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  lockStatus: 'locked' | 'unlocked';
  lastSeen?: string;
}
export function MDMPanel({
  deviceId,
  deviceType,
  lastKnownLocation,
  lockStatus,
  lastSeen
}: MDMPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-200 bg-brand-50 flex items-center">
        <AlertTriangle className="w-5 h-5 text-brand-600 mr-2" />
        <h3 className="font-semibold text-brand-900">MDM Integration Status</h3>
      </div>

      <div className="p-5 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center text-neutral-500 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Lock Status</span>
            </div>
            <div
              className={`text-lg font-bold ${lockStatus === 'locked' ? 'text-brand-600' : 'text-neutral-400'}`}>
              
              {lockStatus === 'locked' ? 'Device Locked' : 'Not Locked'}
            </div>
          </div>

          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center text-neutral-500 mb-2">
              <Activity className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Last Seen</span>
            </div>
            <div className="text-lg font-bold text-neutral-900">
              {lastSeen || 'Unknown'}
            </div>
          </div>
        </div>

        {lastKnownLocation &&
        <div>
            <div className="flex items-center text-neutral-500 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Last Known GPS Coordinates
              </span>
            </div>

            {/* Simple map placeholder */}
            <div className="bg-neutral-100 rounded-lg h-48 flex items-center justify-center border border-neutral-200 mb-3">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-neutral-700">
                  {lastKnownLocation.lat.toFixed(6)},{' '}
                  {lastKnownLocation.lng.toFixed(6)}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {lastKnownLocation.address}
                </div>
              </div>
            </div>

            <div className="bg-accent-50 border border-accent-100 rounded-lg p-3 text-sm text-accent-800">
              <strong>GPS Tracking Active:</strong> Real-time location updates
              are being received from the MDM platform. Coordinates are logged
              every 15 minutes.
            </div>
          </div>
        }

        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">
            Device Telemetry
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Device ID:</span>
              <span className="font-mono text-neutral-900">{deviceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Device Type:</span>
              <span className="font-medium text-neutral-900">{deviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">MDM Agent Version:</span>
              <span className="text-neutral-900">v2.4.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}