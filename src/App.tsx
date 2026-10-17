import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TripConfigPanel } from './components/TripConfigPanel';
import { WeatherHeatPanel } from './components/WeatherHeatPanel';
import { AttractionsMapPanel } from './components/AttractionsMapPanel';
import { FoodGuidePanel } from './components/FoodGuidePanel';
import { ItineraryView } from './components/ItineraryView';
import { SingaporeTravelerTips } from './components/SingaporeTravelerTips';
import { Footer } from './components/Footer';
import { TripConfig, LiveWeatherData, OverpassAttraction, NominatimPlace } from './types/travel';
import {
  fetchLiveShanghaiWeather,
  fetchLiveHeatStress,
  fetchBundAttractions,
  fetchChinaMapData,
  fetchShanghaiTravelGuide,
  fetchNominatimFood
} from './services/api';
import { Calendar, CloudSun, Landmark, Utensils, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  // 1. Initial Dates Setup (e.g. today to 5 days later)
  const today = new Date();
  const defaultStart = today.toISOString().split('T')[0];
  const fiveDaysLater = new Date(today);
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
  const defaultEnd = fiveDaysLater.toISOString().split('T')[0];

  const [tripConfig, setTripConfig] = useState<TripConfig>({
    startDate: defaultStart,
    endDate: defaultEnd,
    adults: 2,
    seniors: 2,
    children: 1,
    includeSuzhou: true,
    includeHangzhou: true,
    pacePreference: 'gentle'
  });

  const [activeTab, setActiveTab] = useState<string>('itinerary');

  // 2. Live Data States
  const [weather, setWeather] = useState<{ loading: boolean; data: LiveWeatherData | null; error: string | null }>({
    loading: true,
    data: null,
    error: null
  });

  const [heatStress, setHeatStress] = useState<{ loading: boolean; data: any | null; error: string | null }>({
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

  const loadHeatStress = useCallback(async () => {
    setHeatStress(prev => ({ ...prev, loading: true, error: null }));
    const res = await fetchLiveHeatStress();
    setHeatStress({ loading: false, data: res.data, error: res.error });
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
    loadHeatStress();
    loadBundAttractions();
    loadWikivoyage();
    loadFood('Shanghai restaurant');
  }, [loadWeather, loadHeatStress, loadBundAttractions, loadWikivoyage, loadFood]);

  const handleReset = () => {
    setTripConfig({
      startDate: defaultStart,
      endDate: defaultEnd,
      adults: 2,
      seniors: 2,
      children: 1,
      includeSuzhou: true,
      includeHangzhou: true,
      pacePreference: 'gentle'
    });
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
                Designed for Singaporean families traveling to Shanghai with young and old. Enjoy gentle, non-strenuous itineraries with live weather, real OpenStreetMap attractions, and authentic Jiangnan dining.
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

        {/* Sub-goal 1: Set Trip Dates, Family Size, Include Suzhou & Hangzhou */}
        <section id="trip-config">
          <TripConfigPanel
            config={tripConfig}
            onChange={setTripConfig}
            dayCount={calculateDays()}
          />
        </section>

        {/* Tab Navigation for Desktop & Mobile */}
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
            onClick={() => setActiveTab('weather-heat')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'weather-heat'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>2. Live Weather & Heat Stress</span>
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
            <span>3. Bund Attractions, Map & Guide</span>
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
            <span>4. Nominatim Food Guide</span>
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
            <span>5. Singaporean Family Travel Guide</span>
          </button>
        </div>

        {/* Tab Views */}
        <section>
          {activeTab === 'itinerary' && (
            <ItineraryView config={tripConfig} weather={weather.data} />
          )}

          {activeTab === 'weather-heat' && (
            <WeatherHeatPanel
              weather={weather}
              heatStress={heatStress}
              onRefreshWeather={loadWeather}
              onRefreshHeatStress={loadHeatStress}
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
