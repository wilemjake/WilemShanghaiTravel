import React, { useState } from 'react';
import { Utensils, Search, RefreshCw, AlertTriangle, MapPin, Coffee, Heart, CheckCircle2 } from 'lucide-react';
import { NominatimPlace } from '../types/travel';

interface FoodGuidePanelProps {
  foodData: {
    loading: boolean;
    data: NominatimPlace[] | null;
    error: string | null;
  };
  onSearchFood: (query: string) => void;
}

const PRESET_QUERIES = [
  { label: 'All Restaurants', query: 'Shanghai restaurant' },
  { label: 'Xiaolongbao & Dim Sum', query: 'Shanghai dumplings' },
  { label: 'Traditional Jiangnan Cuisine', query: 'Shanghai Jiangnan food' },
  { label: 'Tea Houses & Calm Cafes', query: 'Shanghai teahouse' },
  { label: 'Vegetarian & Light Broths', query: 'Shanghai vegetarian restaurant' }
];

export const FoodGuidePanel: React.FC<FoodGuidePanelProps> = ({ foodData, onSearchFood }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('Shanghai restaurant');

  const handlePresetClick = (query: string) => {
    setSelectedPreset(query);
    onSearchFood(query);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedPreset('');
      onSearchFood(searchInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Shanghai Food Guides (Nominatim OpenStreetMap)
              </h3>
              <p className="text-xs text-slate-400">
                Live query: <code className="font-mono text-emerald-400">GET https://nominatim.openstreetmap.org/search</code>
              </p>
            </div>
          </div>
        </div>

        {/* Singapore Family Dining Advice for Young & Elderly */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Singaporean Family Guide: Gentle & Non-Spicy Shanghai Dining</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Unlike Sichuan or Hunan, classic Shanghai (Benbang / Jiangnan) food is mild, braised, and subtly sweet—ideal for Singaporean grandparents and young kids!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
            <div>
              <strong className="text-emerald-400 block mb-0.5">Top Senior Favorites:</strong>
              Steamed soup dumplings (Xiaolongbao), Scallion oil noodles (Congyou Banmian), Braised winter melon.
            </div>
            <div>
              <strong className="text-emerald-400 block mb-0.5">Health Tips for Elders:</strong>
              Ask for <em className="text-white">"shǎo yóu, shǎo yán"</em> (less oil, less salt) when ordering. Always drink warm boiled water or tea.
            </div>
            <div>
              <strong className="text-emerald-400 block mb-0.5">Payment & Seating:</strong>
              Scan QR via Alipay/WeChat at the table. Choose elevator-accessible mall restaurants (IFC, K11, Jing'an Kerry Centre) for elders.
            </div>
          </div>
        </div>

        {/* Preset Category Filter Buttons */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400 block">Quick Family Food Categories:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.query)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                  selectedPreset === preset.query
                    ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input for custom Nominatim query */}
        <form onSubmit={handleCustomSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search custom food places via Nominatim (e.g., 'Jing'an restaurant', 'Nanjing Road tea')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={foodData.loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {foodData.loading ? 'Searching...' : 'Search Nominatim'}
          </button>
        </form>

        {/* State 1: Loading */}
        {foodData.loading && (
          <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
            <span>Connecting to Nominatim OpenStreetMap food directory...</span>
          </div>
        )}

        {/* State 2: Sub-goal 4 - Empty, slow, or refused */}
        {!foodData.loading && foodData.error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-4 text-xs text-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Nominatim Food Guide Unavailable (Refused, Empty, or Timed Out)</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-800">
              {foodData.error}
            </p>
            <p className="text-slate-400 text-[11px]">
              *Guardrail enforced: No synthetic restaurants or mock listings are created when live API query fails.
            </p>
          </div>
        )}

        {/* State 3: Populated Results */}
        {!foodData.loading && !foodData.error && foodData.data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Found <strong className="text-white font-mono">{foodData.data.length}</strong> live eateries from Nominatim OSM.
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live OpenStreetMap data
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {foodData.data.map((place) => (
                <div
                  key={place.place_id}
                  className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-100 text-xs leading-snug">
                      {place.display_name.split(',')[0]}
                    </h4>
                    <span className="text-[10px] text-amber-400/90 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 uppercase">
                      {place.type || 'Eatery'}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    {place.display_name}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Lat {parseFloat(place.lat).toFixed(4)}, Lon {parseFloat(place.lon).toFixed(4)}
                    </span>
                    <a
                      href={`https://www.openstreetmap.org/${place.osm_type}/${place.osm_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      View on OSM
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
