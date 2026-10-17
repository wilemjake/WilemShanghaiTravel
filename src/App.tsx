import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TripConfigPanel } from './components/TripConfigPanel';
import { HotelManager } from './components/HotelManager';
import { WeatherPanel } from './components/WeatherPanel';
import { AttractionsMapPanel } from './components/AttractionsMapPanel';
import { FoodGuidePanel } from './components/FoodGuidePanel';
import { ItineraryView } from './components/ItineraryView';
import { SingaporeTravelerTips } from './components/SingaporeTravelerTips';
import { Footer } from './components/Footer';
import {
  TripConfig,
  LiveWeatherData,
  OverpassAttraction,
  NominatimPlace,
  HotelStay,
  DayCustomization
} from './types/travel';
import {
  fetchLiveShanghaiWeather,
  fetchBundAttractions,
  fetchChinaMapData,
  fetchShanghaiTravelGuide,
  fetchNominatimFood
} from './services/api';
import { Calendar, Building2, CloudSun, Landmark, Utensils, ShieldCheck, Heart } from 'lucide-react';

const INITIAL_HOTELS: HotelStay[] = [
  {
    id: 'hotel_1',
    name: 'Grand Central Hotel Shanghai',
    district: 'Huangpu (People\'s Square / East Nanjing Road)',
    address: 'No. 505 Jiujiang Road, Huangpu District, Shanghai',
    checkInDate: '2026-11-01',
    checkOutDate: '2026-11-06',
    accessibilityNotes: 'Step-free entrance, spacious elevators, 200m from East Nanjing Road Metro Line 2/10. Great quiet beds for grandparents.'
  }
];

export default function App() {
  // 1. Initial Dates Setup
  const [tripConfig, setTripConfig] = useState<TripConfig>(() => {
    const saved = localStorage.getItem('wilem_trip_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      startDate: '2026-11-01',
      endDate: '2026-11-06',
      adults: 2,
      seniors: 2,
      children: 1,
      includeHangzhou: true,
      hangzhouDate: '2026-11-02',
      includeSuzhou: true,
      suzhouDate: '2026-11-03',
      pacePreference: 'gentle'
    };
  });

  // 2. Hotel stays state
  const [hotels, setHotels] = useState<HotelStay[]>(() => {
    const saved = localStorage.getItem('wilem_hotels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_HOTELS;
  });

  // 3. Day customizations (key timings, rough plans)
  const [dayCustomizations, setDayCustomizations] = useState<Record<string, Partial<DayCustomization>>>(() => {
    const saved = localStorage.getItem('wilem_day_customizations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      '2026-11-02': {
        destination: 'Hangzhou',
        themeTitle: 'Hangzhou Day Trip: Serene West Lake & Longjing Tea Village',
        morningTime: '09:15',
        lunchTime: '12:30',
        afternoonTime: '14:30',
        dinnerTime: '18:15',
        roughPlanNotes: 'Planning for Hangzhou on 2 Nov: Take 09:15 CRH train from Hongqiao. Electric boat cruise on West Lake at 11am; tea tasting at Longjing; return on 17:15 train.'
      },
      '2026-11-03': {
        destination: 'Suzhou',
        themeTitle: 'Suzhou Day Trip: Ancient Canals & Step-Free Garden Art',
        morningTime: '09:30',
        lunchTime: '12:45',
        afternoonTime: '14:45',
        dinnerTime: '17:45',
        roughPlanNotes: 'Planning for Suzhou on 3 Nov: 25-min CRH train to Suzhou. Visit wheelchair-friendly I.M. Pei Suzhou Museum, followed by Shantang Canal boat ride.'
      }
    };
  });

  const [activeTab, setActiveTab] = useState<string>('itinerary');

  // 4. Live Data States
  const [weather, setWeather] = useState<{ loading: boolean; data: LiveWeatherData | null; error: string | null }>({
    loading: true,
    data: null,
    error: null
  });

  const [attractions, setAttractions] = useState<{ loading: boolean; data: OverpassAttraction[] | null; error: string | null }>({
    loading: true,
    data: null,
    error: null
  });

  const [chinaMap, setChinaMap] = useState<{ loading: boolean; data: any | null; error: string | null }>({
    loading: false,
    data: null,
    error: null
  });

  const [wikivoyage, setWikivoyage] = useState<{ loading: boolean; data: any | null; error: string | null }>({
    loading: true,
    data: null,
    error: null
  });

  const [foodData, setFoodData] = useState<{ loading: boolean; data: NominatimPlace[] | null; error: string | null }>({
    loading: true,
    data: null,
    error: null
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('wilem_trip_config', JSON.stringify(tripConfig));
  }, [tripConfig]);

  useEffect(() => {
    localStorage.setItem('wilem_hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('wilem_day_customizations', JSON.stringify(dayCustomizations));
  }, [dayCustomizations]);

  // Calculate day count
  const calculateDays = () => {
    const s = new Date(tripConfig.startDate);
    const e = new Date(tripConfig.endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(14, diff));
  };

  // Fetch callbacks
  const loadWeather = useCallback(async () => {
    setWeather(prev => ({ ...prev, loading: true, error: null }));
    const res = await fetchLiveShanghaiWeather();
    setWeather({ loading: false, data: res.data, error: res.error });
  }, []);

  const loadBundAttractions = useCallback(async () => {
    setAttractions(prev => ({ ...prev, loading: true, error: null }));
    const res = await fetchBundAttractions();
    setAttractions({ loading: false, data: res.data, error: res.error });
  }, []);

  const loadChinaMap = useCallback(async () => {
    setChinaMap(prev => ({ ...prev, loading: true, error: null }));
    const res = await fetchChinaMapData();
    setChinaMap({ loading: false, data: res.data, error: res.error });
  }, []);

  const loadWikivoyage = useCallback(async () => {
    setWikivoyage(prev => ({ ...prev, loading: true, error: null }));
    const res = await fetchShanghaiTravelGuide();
    setWikivoyage({ loading: false, data: res.data, error: res.error });
  }, []);

  const loadFood = useCallback(async (query = 'Shanghai restaurant') => {
    setFoodData(prev => ({ ...prev, loading: true, error: null }));
    const res = await fetchNominatimFood(query);
    setFoodData({ loading: false, data: res.data, error: res.error });
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather();
    loadBundAttractions();
    loadWikivoyage();
    loadFood('Shanghai restaurant');
  }, [loadWeather, loadBundAttractions, loadWikivoyage, loadFood]);

  // Hotel management handlers
  const handleAddHotel = (hotel: HotelStay) => {
    setHotels(prev => [...prev, hotel]);
  };

  const handleDeleteHotel = (id: string) => {
    setHotels(prev => prev.filter(h => h.id !== id));
  };

  // Day customization handler
  const handleUpdateDayCustomization = (dateStr: string, updates: Partial<DayCustomization>) => {
    setDayCustomizations(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        ...updates
      }
    }));
  };

  const handleReset = () => {
    const defaultConfig: TripConfig = {
      startDate: '2026-11-01',
      endDate: '2026-11-06',
      adults: 2,
      seniors: 2,
      children: 1,
      includeHangzhou: true,
      hangzhouDate: '2026-11-02',
      includeSuzhou: true,
      suzhouDate: '2026-11-03',
      pacePreference: 'gentle'
    };
    setTripConfig(defaultConfig);
    setHotels(INITIAL_HOTELS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 3-Zone Top Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onReset={handleReset} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Introduction */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Shanghai Family Itinerary Planner
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Designed for Singaporean families traveling to Shanghai with young and elderly. Plan non-strenuous itineraries with custom timings, hotel stays, day trips to Hangzhou & Suzhou, and Michelin dining guides.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Senior & Kid Low-Strenuous Mode</span>
              </span>
            </div>
          </div>
        </section>

        {/* Sub-goal 1 & Sub-goal 2: Trip Parameters */}
        <section id="trip-config">
          <TripConfigPanel
            config={tripConfig}
            onChange={setTripConfig}
            dayCount={calculateDays()}
          />
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'itinerary'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1. Daily Itinerary ({calculateDays()} Days)</span>
          </button>

          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'hotels'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>2. Hotels & Stays ({hotels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'weather'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>3. Live Weather Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('attractions-map')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'attractions-map'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>4. Bund Attractions, Map & Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('food-guide')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'food-guide'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>5. Michelin & Food Guides</span>
          </button>

          <button
            onClick={() => setActiveTab('sg-tips')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sg-tips'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>6. SG Family Tips</span>
          </button>
        </div>

        {/* Tab Views */}
        <section>
          {activeTab === 'itinerary' && (
            <ItineraryView
              config={tripConfig}
              weather={weather.data}
              hotels={hotels}
              customizations={dayCustomizations}
              onUpdateDayCustomization={handleUpdateDayCustomization}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelManager
              hotels={hotels}
              onAddHotel={handleAddHotel}
              onDeleteHotel={handleDeleteHotel}
              tripStartDate={tripConfig.startDate}
              tripEndDate={tripConfig.endDate}
            />
          )}

          {activeTab === 'weather' && (
            <WeatherPanel
              weather={weather}
              onRefreshWeather={loadWeather}
            />
          )}

          {activeTab === 'attractions-map' && (
            <AttractionsMapPanel
              attractions={attractions}
              chinaMap={chinaMap}
              wikivoyage={wikivoyage}
              onRefreshAttractions={loadBundAttractions}
              onRefreshChinaMap={loadChinaMap}
              onRefreshWikivoyage={loadWikivoyage}
            />
          )}

          {activeTab === 'food-guide' && (
            <FoodGuidePanel
              foodData={foodData}
              onSearchFood={loadFood}
            />
          )}

          {activeTab === 'sg-tips' && (
            <SingaporeTravelerTips />
          )}
        </section>
      </main>

      {/* Sub-goal 6: Footer credits "METEO, Nominatim, Overpass" */}
      <Footer />
    </div>
  );
}
