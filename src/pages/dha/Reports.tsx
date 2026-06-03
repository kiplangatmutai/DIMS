import React from 'react';
import { Download, Filter } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line } from
'recharts';
export function Reports() {
  const distributionData: any[] = [];

  const inventoryData: any[] = [];

  const trendData: any[] = [];

  const COLORS = ['#0ea5e9', '#dc2626', '#10b981', '#f59e0b', '#6366f1'];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Analytics & Reports
          </h1>
          <p className="text-neutral-500 mt-1">
            System-wide data visualization and exports.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-neutral-300 bg-white text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50">
            <Filter className="w-4 h-4 mr-2" />
            Global Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700">
            <Download className="w-4 h-4 mr-2" />
            Export All CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-neutral-900">
              Nationwide Distribution (Top 5)
            </h2>
            <button className="text-neutral-400 hover:text-brand-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e5e5" />
                
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#737373',
                    fontSize: 12
                  }} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#737373',
                    fontSize: 12
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#f5f5f5'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }} />
                
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Breakdown */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-neutral-900">
              Active Inventory by Type
            </h2>
            <button className="text-neutral-400 hover:text-brand-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {inventoryData.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} />

                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }} />
                
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/3 space-y-3">
              {inventoryData.map((entry, index) =>
              <div key={entry.name} className="flex items-center text-sm">
                  <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length]
                  }}>
                </div>
                  <span className="text-neutral-600">{entry.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Replacement Trends */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-neutral-900">
              Hardware Replacement Trends (YTD)
            </h2>
            <button className="text-neutral-400 hover:text-brand-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e5e5" />
                
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#737373',
                    fontSize: 12
                  }} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#737373',
                    fontSize: 12
                  }} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5'
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="replacements"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#dc2626',
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>);

}
