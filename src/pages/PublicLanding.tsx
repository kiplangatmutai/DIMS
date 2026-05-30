import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Map as MapIcon,
  Shield,
  ActivitySquare,
  Users,
  Server } from
'lucide-react';
import { COUNTIES, DEVICE_TYPES } from '../data/mockData';
import { Logo } from '../components/ui/Logo';
export function PublicLanding() {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  // Mock data for the map
  const getCountyColor = (county: string) => {
    if (selectedCounty === county) return 'fill-brand-500';
    // Randomize some shades of blue based on string length for demo purposes
    const intensity = county.length % 3 + 1;
    return `fill-accent-${intensity}00 hover:fill-accent-400 cursor-pointer transition-colors`;
  };
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3 text-brand-600">
          <Logo variant="default" className="h-9" />
          <span className="h-8 w-px bg-neutral-200" />
          <span className="text-xl font-bold tracking-tight">
            DIMS Public Portal
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
          
          Internal Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="bg-accent-50 border-b border-accent-100 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            National Device Inventory Distribution
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-10">
            Real-time visibility into the deployment and operational status of
            digital health devices across all 47 counties in Kenya.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedDevice('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDevice === 'All' ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'}`}>
              
              All Devices
            </button>
            {DEVICE_TYPES.map((type) =>
            <button
              key={type}
              onClick={() => setSelectedDevice(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDevice === type ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'}`}>
              
                {type}s
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6 flex-1 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
          {/* Interactive Map (Simplified SVG representation) */}
          <div className="w-full lg:w-2/3 bg-neutral-50 rounded-xl border border-neutral-200 p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center space-x-2 text-neutral-500 bg-white px-3 py-1.5 rounded-md shadow-sm text-sm font-medium border border-neutral-200">
              <MapIcon className="w-4 h-4" />
              <span>Interactive GIS View</span>
            </div>

            {/* Abstract representation of Kenya Map with clickable regions */}
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full max-h-[600px] drop-shadow-md">
              
              {/* This is a highly simplified abstract representation for demo purposes */}
              <g stroke="#ffffff" strokeWidth="2">
                {/* Turkana / North Rift area */}
                <path
                  d="M 200 100 L 350 120 L 300 250 L 150 200 Z"
                  className={getCountyColor('Uasin Gishu')}
                  onClick={() => setSelectedCounty('Uasin Gishu')} />
                
                {/* North Eastern */}
                <path
                  d="M 350 120 L 600 150 L 650 350 L 450 300 Z"
                  className={getCountyColor('Garissa')}
                  onClick={() => setSelectedCounty('Garissa')} />
                
                {/* Western / Nyanza */}
                <path
                  d="M 150 200 L 300 250 L 250 400 L 100 350 Z"
                  className={getCountyColor('Kisumu')}
                  onClick={() => setSelectedCounty('Kisumu')} />
                
                {/* Central / Rift */}
                <path
                  d="M 300 250 L 450 300 L 400 450 L 250 400 Z"
                  className={getCountyColor('Nakuru')}
                  onClick={() => setSelectedCounty('Nakuru')} />
                
                {/* Nairobi / Central */}
                <path
                  d="M 400 450 L 450 300 L 550 400 L 480 500 Z"
                  className={getCountyColor('Nairobi')}
                  onClick={() => setSelectedCounty('Nairobi')} />
                
                {/* Coast */}
                <path
                  d="M 450 300 L 650 350 L 700 550 L 550 500 L 480 500 Z"
                  className={getCountyColor('Mombasa')}
                  onClick={() => setSelectedCounty('Mombasa')} />
                
              </g>

              {/* Labels for major counties */}
              <text
                x="250"
                y="180"
                fontSize="14"
                fill="#1e293b"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none">
                
                Uasin Gishu
              </text>
              <text
                x="500"
                y="220"
                fontSize="14"
                fill="#1e293b"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none">
                
                Garissa
              </text>
              <text
                x="200"
                y="300"
                fontSize="14"
                fill="#1e293b"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none">
                
                Kisumu
              </text>
              <text
                x="350"
                y="350"
                fontSize="14"
                fill="#1e293b"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none">
                
                Nakuru
              </text>
              <text
                x="450"
                y="420"
                fontSize="14"
                fill="#1e293b"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none">
                
                Nairobi
              </text>
              <text
                x="580"
                y="450"
                fontSize="14"
                fill="#1e293b"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none">
                
                Mombasa
              </text>
            </svg>
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-1/3 space-y-6">
            {selectedCounty ?
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="bg-brand-600 px-6 py-4 text-white flex justify-between items-center">
                  <h3 className="font-bold text-lg">{selectedCounty} County</h3>
                  <button
                  onClick={() => setSelectedCounty(null)}
                  className="text-brand-200 hover:text-white text-sm">
                  
                    Close
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                      <div className="text-sm text-neutral-500 mb-1">
                        Total Devices
                      </div>
                      <div className="text-2xl font-bold text-neutral-900">
                        {selectedDevice === 'All' ? '4,291' : '1,042'}
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                      <div className="text-sm text-neutral-500 mb-1">
                        Active Facilities
                      </div>
                      <div className="text-2xl font-bold text-neutral-900">
                        142
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                      Distribution by Type
                    </h4>
                    <div className="space-y-3">
                      {DEVICE_TYPES.map((type) =>
                    <div
                      key={type}
                      className="flex items-center justify-between">
                      
                          <span className="text-sm text-neutral-600">
                            {type}s
                          </span>
                          <div className="flex items-center w-2/3">
                            <div className="h-2 bg-neutral-100 rounded-full w-full mr-3 overflow-hidden">
                              <div
                            className="h-full bg-accent-500 rounded-full"
                            style={{
                              width: `${Math.floor(Math.random() * 60) + 20}%`
                            }} />
                          
                            </div>
                            <span className="text-sm font-medium text-neutral-900 w-10 text-right">
                              {Math.floor(Math.random() * 1000) + 100}
                            </span>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">
                        Operational Status
                      </span>
                      <span className="font-medium text-emerald-600">
                        94.2% Online
                      </span>
                    </div>
                  </div>
                </div>
              </div> :

            <div className="bg-accent-50 rounded-xl border border-accent-100 p-8 text-center h-full flex flex-col justify-center items-center text-accent-800 min-h-[400px]">
                <MapIcon className="w-12 h-12 mb-4 text-accent-400" />
                <h3 className="text-lg font-semibold mb-2">Select a Region</h3>
                <p className="text-accent-600/80">
                  Click on any county on the map to view detailed device
                  distribution metrics and operational status.
                </p>
              </div>
            }
          </div>
        </div>
      </section>

      {/* Key Stats Strip */}
      <section className="bg-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <ActivitySquare className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">124,592</div>
            <div className="text-neutral-400 text-sm">
              Total Devices Tracked
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">8,405</div>
            <div className="text-neutral-400 text-sm">Active Facilities</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapIcon className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">47</div>
            <div className="text-neutral-400 text-sm">Counties Served</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Server className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">99.9%</div>
            <div className="text-neutral-400 text-sm">System Uptime</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 px-6 text-center text-sm text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="w-4 h-4" />
            <span>Digital Health Agency © 2026</span>
          </div>
          <div className="space-x-6">
            <a href="#" className="hover:text-brand-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-brand-600 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>);

}