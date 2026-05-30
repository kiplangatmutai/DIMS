import React, { useEffect, useState } from 'react';
import { Activity, Server, ShieldCheck, Users } from 'lucide-react';
import { api } from '../../config/api';

interface DataResponse<T> {
  data: T;
}

interface Summary {
  totalDevices: number;
  activeDevices: number;
  maintenanceDevices: number;
  stolenDevices: number;
  pendingRequests: number;
  approvedRequests: number;
  totalFacilities: number;
  totalCounties: number;
}

interface ApiUser {
  id: string;
}

export function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get<DataResponse<Summary>>('/dashboard/summary'),
      api.get<DataResponse<ApiUser[]>>('/users')
    ]).then(([summaryResponse, usersResponse]) => {
      setSummary(summaryResponse.data);
      setUserCount(usersResponse.data.length);
    }).catch(() => {
      setSummary({
        totalDevices: 0,
        activeDevices: 0,
        maintenanceDevices: 0,
        stolenDevices: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        totalFacilities: 0,
        totalCounties: 0
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Super Admin Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            System overview based on live backend records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Server className="w-5 h-5 mr-2 text-brand-500" />
            <span className="text-sm font-medium">Total Devices</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">
            {summary?.totalDevices ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Users className="w-5 h-5 mr-2 text-accent-500" />
            <span className="text-sm font-medium">System Users</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{userCount}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <Activity className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Pending Requests</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">
            {summary?.pendingRequests ?? 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="flex items-center text-neutral-500 mb-2">
            <ShieldCheck className="w-5 h-5 mr-2 text-brand-600" />
            <span className="text-sm font-medium">Facilities</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">
            {summary?.totalFacilities ?? 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="font-semibold text-neutral-900">System Status</h2>
        </div>
        <div className="p-8 text-center text-neutral-500">
          No operational activity has been recorded yet.
        </div>
      </div>
    </div>);
}
