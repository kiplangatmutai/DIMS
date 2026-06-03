import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActivitySquare,
  Map as MapIcon,
  Server,
  Shield,
  Users
} from 'lucide-react';
import { DEVICE_TYPES } from '../data/mockData';
import { Logo } from '../components/ui/Logo';
import { KenyaCountyMap } from '../components/maps/KenyaCountyMap';

export function PublicLanding() {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState('All');

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

      <section className="bg-accent-50 border-b border-accent-100 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            National Device Inventory Distribution
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-10">
            Visibility into approved deployment and operational records for
            digital health devices across Kenya.
          </p>

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

      <section className="py-12 px-6 flex-1 bg-white">
        <div className="max-w-7xl mx-auto">
          <KenyaCountyMap />
        </div>
      </section>

      <section className="bg-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <ActivitySquare className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-neutral-400 text-sm">
              Total Devices Tracked
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-neutral-400 text-sm">Active Facilities</div>
          </div>
            <div className="flex flex-col items-center text-center">
              <MapIcon className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">47</div>
            <div className="text-neutral-400 text-sm">Counties Mapped</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Server className="w-8 h-8 text-brand-500 mb-3" />
            <div className="text-3xl font-bold mb-1">-</div>
            <div className="text-neutral-400 text-sm">System Uptime</div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-neutral-200 py-8 px-6 text-center text-sm text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="w-4 h-4" />
            <span>Digital Health Agency (c) 2026</span>
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
