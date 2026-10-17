import React from 'react';
import { CloudSun, Wind, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { LiveWeatherData } from '../types/travel';

interface WeatherPanelProps {
  weather: {
    loading: boolean;
    data: LiveWeatherData | null;
    error: string | null;
  };
  onRefreshWeather: () => void;
}

// Weather code interpreter for Open-Meteo WMO codes
function getWeatherDescription(code: number | undefined): string {
  if (code === undefined) return 'Unknown';
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Mainly Clear / Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snow Flurries';
  if (code >= 80 && code <= 82) return 'Heavy Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return `Weather Code ${code}`;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({
  weather,
  onRefreshWeather
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Live Shanghai Weather Forecast
              </h3>
              <p className="text-xs text-slate-400">
                Source: Open-Meteo Live API (Lat 31.2304, Lon 121.4737 · Asia/Shanghai)
              </p>
            </div>
          </div>
          <button
            onClick={onRefreshWeather}
            disabled={weather.loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${weather.loading ? 'animate-spin' : ''}`} />
            <span>{weather.loading ? 'Checking...' : 'Refresh Weather'}</span>
          </button>
        </div>

        {weather.loading ? (
          <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
            <span>Fetching live weather data from Open-Meteo...</span>
          </div>
        ) : weather.error ? (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-4 text-xs text-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Weather Data Unavailable (Empty, Slow, or Refused)</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-800">
              {weather.error}
            </p>
            <p className="text-slate-400 text-[11px]">
              *Guardrail enforced: No sample or fabricated weather numbers are displayed when live endpoint fails.
            </p>
          </div>
        ) : weather.data ? (
          <div className="space-y-4">
            {/* Current Conditions Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-lg border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Temperature</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {weather.data.current_weather?.temperature}°C
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">
                  {getWeatherDescription(weather.data.current_weather?.weathercode)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Wind Speed</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {weather.data.current_weather?.windspeed}
                  <span className="text-xs font-normal text-slate-400 ml-1">km/h</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Direction {weather.data.current_weather?.winddirection}°
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Today's Range</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {weather.data.daily?.temperature_2m_max?.[0]}° / {weather.data.daily?.temperature_2m_min?.[0]}°
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Max / Min Temp
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Precipitation Sum</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {weather.data.daily?.precipitation_sum?.[0] ?? 0}
                  <span className="text-xs font-normal text-slate-400 ml-1">mm</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {(weather.data.daily?.precipitation_sum?.[0] ?? 0) > 2 ? 'Pack umbrella' : 'Dry conditions'}
                </span>
              </div>
            </div>

            {/* Daily 7-Day Forecast */}
            {weather.data.daily && weather.data.daily.time && (
              <div>
                <span className="text-xs font-medium text-slate-300 block mb-2">
                  7-Day Trend (Plan Outdoor Bund & Garden Walks on Drier Days)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {weather.data.daily.time.slice(0, 7).map((dateStr, idx) => {
                    const maxT = weather.data!.daily?.temperature_2m_max?.[idx];
                    const minT = weather.data!.daily?.temperature_2m_min?.[idx];
                    const precip = weather.data!.daily?.precipitation_sum?.[idx] ?? 0;
                    const dateObj = new Date(dateStr);
                    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

                    return (
                      <div
                        key={dateStr}
                        className="bg-slate-950/50 p-2.5 rounded border border-slate-800 text-center space-y-1"
                      >
                        <span className="text-[11px] font-medium text-slate-300 block">{dayLabel}</span>
                        <div className="text-xs font-mono tabular-nums text-white font-bold">
                          {maxT}° / <span className="text-slate-400">{minT}°</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {precip > 0 ? `${precip}mm rain` : 'No rain'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
