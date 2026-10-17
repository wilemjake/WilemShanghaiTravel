import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            WilemShanghaiTravel
          </span>
        </div>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'itinerary'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Itinerary Planner
          </button>
          <button
            onClick={() => setActiveTab('weather-heat')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'weather-heat'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Live Weather & Heat
          </button>
          <button
            onClick={() => setActiveTab('attractions-map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'attractions-map'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Bund Attractions & Map
          </button>
          <button
            onClick={() => setActiveTab('food-guide')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'food-guide'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Food Guides
          </button>
          <button
            onClick={() => setActiveTab('sg-tips')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'sg-tips'
                ? 'border-emerald-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            SG Family Tips
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-700"
            title="Reset trip settings to comfortable default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
