import React from 'react';
import { Calendar, Users, Train, Heart, AlertCircle, Clock } from 'lucide-react';
import { TripConfig } from '../types/travel';

interface TripConfigPanelProps {
  config: TripConfig;
  onChange: (newConfig: TripConfig) => void;
  dayCount: number;
}

export const TripConfigPanel: React.FC<TripConfigPanelProps> = ({ config, onChange, dayCount }) => {
  const handleDateChange = (field: 'startDate' | 'endDate', val: string) => {
    onChange({ ...config, [field]: val });
  };

  const handleCountChange = (field: 'adults' | 'seniors' | 'children', delta: number) => {
    const minVal = field === 'adults' ? 1 : 0;
    const current = config[field];
    const updated = Math.max(minVal, current + delta);
    onChange({ ...config, [field]: updated });
  };

  const totalFamily = config.adults + config.seniors + config.children;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Trip Parameters & Family Setup</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Set your dates, family member counts, and schedule exact dates for Suzhou and Hangzhou day trips.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <span className="tabular-nums bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            {dayCount} {dayCount === 1 ? 'Day' : 'Days'} Itinerary
          </span>
          <span className="tabular-nums bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            {totalFamily} Travelers
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Trip Dates */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Trip Dates</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] text-slate-400 mb-1">Arrival Date</span>
              <input
                type="date"
                value={config.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 mb-1">Departure Date</span>
              <input
                type="date"
                value={config.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                min={config.startDate}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            *Singapore passport holders enjoy 30 days visa-free entry to China.
          </p>
        </div>

        {/* 2. Family Size Breakdown */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Family Size Breakdown</span>
          </label>
          <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Adults (18–64)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCountChange('adults', -1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-mono text-xs tabular-nums text-white">
                  {config.adults}
                </span>
                <button
                  type="button"
                  onClick={() => handleCountChange('adults', 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Seniors */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-300">Elderly (65+)</span>
                <Heart className="w-3 h-3 text-rose-400 inline" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCountChange('seniors', -1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-mono text-xs tabular-nums text-white">
                  {config.seniors}
                </span>
                <button
                  type="button"
                  onClick={() => handleCountChange('seniors', 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Children / Teens</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCountChange('children', -1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-mono text-xs tabular-nums text-white">
                  {config.children}
                </span>
                <button
                  type="button"
                  onClick={() => handleCountChange('children', 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Nearby Day Trips with Specific Dates */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Train className="w-4 h-4 text-emerald-400" />
            <span>Nearby City Day Trips (CRH High-Speed Rail)</span>
          </label>
          <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            {/* Hangzhou Day Trip */}
            <div className="space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeHangzhou}
                  onChange={(e) => onChange({ ...config, includeHangzhou: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Hangzhou Day Trip (45 min CRH)</span>
                  <span className="text-[11px] text-slate-400 block leading-relaxed">
                    West Lake electric cruise boat & shaded Longjing tea village.
                  </span>
                </div>
              </label>

              {config.includeHangzhou && (
                <div className="pl-6 pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Scheduled Date:</span>
                  <input
                    type="date"
                    value={config.hangzhouDate || config.startDate}
                    min={config.startDate}
                    max={config.endDate}
                    onChange={(e) => onChange({ ...config, hangzhouDate: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Suzhou Day Trip */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeSuzhou}
                  onChange={(e) => onChange({ ...config, includeSuzhou: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Suzhou Day Trip (25 min CRH)</span>
                  <span className="text-[11px] text-slate-400 block leading-relaxed">
                    Gentle classical canals, Shantang street boat rides, and flat paved gardens.
                  </span>
                </div>
              </label>

              {config.includeSuzhou && (
                <div className="pl-6 pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Scheduled Date:</span>
                  <input
                    type="date"
                    value={config.suzhouDate || config.endDate}
                    min={config.startDate}
                    max={config.endDate}
                    onChange={(e) => onChange({ ...config, suzhouDate: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Senior & Child Low-Strenuous Advisory Badge */}
      {(config.seniors > 0 || config.children > 0) && (
        <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-3 text-xs text-emerald-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white block">
              Gentle Family Pacing Activated ({config.seniors} Seniors, {config.children} Children)
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Itinerary schedules are adjusted to start at 9:30 AM (avoiding morning subway rush), capping walking distances to under 7,500 steps/day with mandatory seated lunch breaks and afternoon tea respites.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
