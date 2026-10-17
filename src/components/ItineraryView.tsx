import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Train,
  ChevronDown,
  ChevronUp,
  Footprints,
  ShieldCheck,
  SunMedium,
  Building2,
  Edit3,
  Check,
  Sparkles
} from 'lucide-react';
import { TripConfig, LiveWeatherData, HotelStay, DayCustomization } from '../types/travel';

interface ItineraryViewProps {
  config: TripConfig;
  weather: LiveWeatherData | null;
  hotels: HotelStay[];
  customizations: Record<string, Partial<DayCustomization>>;
  onUpdateDayCustomization: (dateStr: string, updates: Partial<DayCustomization>) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  config,
  weather,
  hotels,
  customizations,
  onUpdateDayCustomization
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Compute date array from startDate to endDate
  const getDatesBetween = (startStr: string, endStr: string): string[] => {
    const dates: string[] = [];
    const curr = new Date(startStr);
    const end = new Date(endStr);
    
    let count = 0;
    while (curr <= end && count < 14) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
      count++;
    }
    return dates.length > 0 ? dates : [startStr];
  };

  const tripDates = getDatesBetween(config.startDate, config.endDate);
  const totalDays = tripDates.length;

  // Determine active hotel for a given date
  const getHotelForDate = (dateStr: string): HotelStay | undefined => {
    return hotels.find((h) => dateStr >= h.checkInDate && dateStr <= h.checkOutDate);
  };

  // Determine city for a given date based on user's config
  const getCityForDate = (dateStr: string, dayNum: number): 'Shanghai' | 'Suzhou' | 'Hangzhou' => {
    const custom = customizations[dateStr];
    if (custom?.destination && custom.destination !== 'Custom') {
      return custom.destination as any;
    }
    if (config.includeHangzhou && config.hangzhouDate === dateStr) {
      return 'Hangzhou';
    }
    if (config.includeSuzhou && config.suzhouDate === dateStr) {
      return 'Suzhou';
    }
    // Fallback automatic assignment if user selected includeSuzhou / includeHangzhou without explicit date
    if (config.includeHangzhou && !config.hangzhouDate && dayNum === 3) {
      return 'Hangzhou';
    }
    if (config.includeSuzhou && !config.suzhouDate && dayNum === 2) {
      return 'Suzhou';
    }
    return 'Shanghai';
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Singaporean Family Daily Itinerary ({totalDays} Days)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customizable schedule with editable key timings, rough plans, and hotel linkages for {config.adults} Adults, {config.seniors} Seniors, {config.children} Kids.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Senior Step-Cap & Elevator Paced</span>
          </div>
        </div>

        {/* Quick Instructions & Pacing Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Custom Key Timings:</strong>
              <span className="text-slate-400 text-[11px]">
                Click "Edit Timing & Plans" on any day to customize departure, lunch, afternoon tea, or dinner times.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Train className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Flexible City Days:</strong>
              <span className="text-slate-400 text-[11px]">
                Plan Hangzhou or Suzhou on any specific date (e.g. 2 Nov for Hangzhou, 3 Nov for Suzhou).
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Integrated Hotel Stays:</strong>
              <span className="text-slate-400 text-[11px]">
                Each day highlights your base hotel with barrier-free transit and proximity notes.
              </span>
            </div>
          </div>
        </div>

        {/* Day Cards */}
        <div className="space-y-4 pt-2">
          {tripDates.map((dateStr, idx) => {
            const dayNum = idx + 1;
            const isExpanded = expandedDay === dayNum;
            const isEditing = editingDay === dateStr;
            const city = getCityForDate(dateStr, dayNum);
            const activeHotel = getHotelForDate(dateStr);
            const custom = customizations[dateStr] || {};

            // Weather forecast matching
            const dayForecastMax = weather?.daily?.temperature_2m_max?.[idx];
            const dayForecastMin = weather?.daily?.temperature_2m_min?.[idx];
            const dayForecastPrecip = weather?.daily?.precipitation_sum?.[idx];

            // Timings (defaults vs custom)
            const morningTime = custom.morningTime || '09:30';
            const lunchTime = custom.lunchTime || '12:30';
            const afternoonTime = custom.afternoonTime || '14:30';
            const dinnerTime = custom.dinnerTime || '18:30';

            // Default themes based on city
            const defaultTheme =
              city === 'Hangzhou'
                ? 'Hangzhou Day Trip: Serene West Lake & Longjing Tea Village'
                : city === 'Suzhou'
                ? 'Suzhou Day Trip: Ancient Canals & Step-Free Garden Art'
                : dayNum === 1
                ? 'Welcome to Shanghai: Gentle Promenade & Bund Skyline'
                : dayNum % 2 === 0
                ? 'Classical Heritage: Yu Garden & Huxinting Tea Pavilion'
                : 'Tree-Lined French Concession & Lujiazui High-Tech Skyline';

            const themeTitle = custom.themeTitle || defaultTheme;

            return (
              <div
                key={dateStr}
                className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/40">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-xs font-mono font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded">
                      Day {dayNum}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      {dateStr}
                    </span>
                    {city !== 'Shanghai' ? (
                      <span className="text-xs font-semibold text-amber-300 flex items-center gap-1 bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 rounded font-mono">
                        <Train className="w-3.5 h-3.5 text-amber-400" /> {city} Day Trip
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Shanghai
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-white">
                      {themeTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {dayForecastMax !== undefined && (
                      <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                        {dayForecastMax}° / {dayForecastMin}°
                        {dayForecastPrecip && dayForecastPrecip > 0 ? ` (${dayForecastPrecip}mm)` : ''}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setEditingDay(isEditing ? null : dateStr)}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-emerald-400" />
                      <span>{isEditing ? 'Done Editing' : 'Edit Timings & Plans'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedDay(isExpanded ? null : dayNum)}
                      className="p-1 text-slate-400 hover:text-white"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Hotel Tag line if active */}
                {activeHotel && (
                  <div className="px-5 py-2 bg-emerald-950/20 border-b border-emerald-900/30 flex flex-wrap items-center justify-between text-xs text-emerald-200 gap-2">
                    <div className="flex items-center gap-1.5 font-sans">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Staying at <strong className="text-white">{activeHotel.name}</strong> ({activeHotel.district})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeHotel.accessibilityNotes || 'Elevator access available'}
                    </span>
                  </div>
                )}

                {/* Edit Form Panel */}
                {isEditing && (
                  <div className="p-5 bg-slate-900/90 border-b border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">
                        Customize Day {dayNum} ({dateStr})
                      </span>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Save & Close
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">City / Destination</label>
                        <select
                          value={city}
                          onChange={(e) => onUpdateDayCustomization(dateStr, { destination: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          <option value="Shanghai">Shanghai (Local Sightseeing)</option>
                          <option value="Hangzhou">Hangzhou (West Lake Day Trip)</option>
                          <option value="Suzhou">Suzhou (Canals & Gardens Day Trip)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Morning Departure</label>
                        <input
                          type="time"
                          value={morningTime}
                          onChange={(e) => onUpdateDayCustomization(dateStr, { morningTime: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Lunch Seated Time</label>
                        <input
                          type="time"
                          value={lunchTime}
                          onChange={(e) => onUpdateDayCustomization(dateStr, { lunchTime: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Dinner / Return Time</label>
                        <input
                          type="time"
                          value={dinnerTime}
                          onChange={(e) => onUpdateDayCustomization(dateStr, { dinnerTime: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Rough Plans & Family Notes for Day {dayNum} (e.g., meet relatives, specific bullet train, shopping)
                      </label>
                      <textarea
                        rows={2}
                        value={custom.roughPlanNotes || ''}
                        onChange={(e) => onUpdateDayCustomization(dateStr, { roughPlanNotes: e.target.value })}
                        placeholder="e.g. Planning to take 09:30 bullet train from Hongqiao. Meet cousin at West Lake at 11am; have tea at Longjing; return at 17:15."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Day Content */}
                {isExpanded && (
                  <div className="p-5 space-y-4">
                    {/* User's custom rough plans if entered */}
                    {custom.roughPlanNotes && (
                      <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-lg text-xs space-y-1">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" /> Your Key Timing & Rough Notes:
                        </span>
                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                          {custom.roughPlanNotes}
                        </p>
                      </div>
                    )}

                    {/* Timeline Schedule with Key Timings */}
                    <div className="space-y-3">
                      {/* Morning Activity */}
                      <div className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-emerald-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {morningTime}
                            </span>
                            <h5 className="font-semibold text-white text-xs">
                              {city === 'Hangzhou'
                                ? 'CRH High-Speed Bullet Train to Hangzhou East'
                                : city === 'Suzhou'
                                ? 'CRH High-Speed Bullet Train to Suzhou Railway Station'
                                : dayNum === 1
                                ? 'Arrival in Shanghai & Hotel Unpack'
                                : dayNum % 2 === 0
                                ? 'Yu Garden & Nine-Turn Zigzag Bridge'
                                : 'French Concession Shaded Tree-Lined Walk'}
                            </h5>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {city === 'Hangzhou'
                              ? 'Shanghai Hongqiao -> Hangzhou East (45 mins)'
                              : city === 'Suzhou'
                              ? 'Shanghai Hongqiao -> Suzhou Station (25 mins)'
                              : 'Step-free gentle walking'}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {city === 'Hangzhou'
                            ? 'Glide comfortably at 300 km/h with priority senior boarding at Hongqiao Station. Zero turbulence, spacious seats.'
                            : city === 'Suzhou'
                            ? 'Quick 25-minute bullet train ride. Suzhou Museum (designed by I.M. Pei) has full elevator access and step-free courtyards.'
                            : dayNum === 1
                            ? 'Check into your hotel, unpack, and let grandparents rest after the 5-hour Singapore flight.'
                            : 'Gentle morning walk after 09:30 to avoid rush-hour crowds. Wide paved walkways with benches.'}
                        </p>
                      </div>

                      {/* Lunch Time */}
                      <div className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-amber-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {lunchTime}
                            </span>
                            <h5 className="font-semibold text-white text-xs">
                              {city === 'Hangzhou'
                                ? 'Lakeside Lunch: West Lake Vinegar Fish & Longjing Tea Shrimp'
                                : city === 'Suzhou'
                                ? 'Historic Songhelou (松鹤楼) Suzhou Classic Cuisine'
                                : 'Seated Jiangnan Family Lunch & Soup Dumplings'}
                            </h5>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Seated dining · Air-conditioned
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          Comfortable sit-down meal. Request "shao you, shao yan" (low oil, low salt) for grandparents. Mild sweet-savory flavors loved by kids.
                        </p>
                      </div>

                      {/* Afternoon Activity & Respite */}
                      <div className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-emerald-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {afternoonTime}
                            </span>
                            <h5 className="font-semibold text-white text-xs">
                              {city === 'Hangzhou'
                                ? 'West Lake Electric Cruise Boat (Zero Walking)'
                                : city === 'Suzhou'
                                ? 'Shantang Canal Covered Boat Ride'
                                : 'Huxinting Teahouse or Shanghai Museum Air-Conditioned Galleries'}
                            </h5>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Mandatory 90-min seated rest
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {city === 'Hangzhou'
                            ? 'Sit together on an electric cruise boat across West Lake. Rest your feet while enjoying the breeze and pagoda views.'
                            : city === 'Suzhou'
                            ? 'Covered motorized canal boat along the 1,200-year-old Shantang canal. Zero steps, soothing water ripples.'
                            : 'Air-conditioned relaxation, hot tea service, and comfortable seating every 15 meters.'}
                        </p>
                      </div>

                      {/* Dinner & Wind Down */}
                      <div className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-indigo-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {dinnerTime}
                            </span>
                            <h5 className="font-semibold text-white text-xs">
                              {city !== 'Shanghai'
                                ? `Return Bullet Train to Shanghai Hongqiao & Hotel Return`
                                : `Dinner & Gentle Bund Promenade`}
                            </h5>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Early bedtime protection
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {city !== 'Shanghai'
                            ? `Take the evening CRH train back to Shanghai Hongqiao. Hail a 6-seater DiDi taxi straight back to ${activeHotel?.name || 'your hotel'} for a restful night.`
                            : `Enjoy dinner followed by a flat stroll along the illuminated Bund promenade. Early sleep for elderly recovery.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
