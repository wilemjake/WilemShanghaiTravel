export interface TripConfig {
  startDate: string;
  endDate: string;
  adults: number;
  seniors: number;
  children: number;
  includeSuzhou: boolean;
  includeHangzhou: boolean;
  pacePreference: 'gentle' | 'moderate';
}

export interface LiveWeatherData {
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
  };
}

export interface HeatStressState {
  loading: boolean;
  data: any | null;
  error: string | null;
  source: string;
}

export interface OverpassAttraction {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    'name:en'?: string;
    tourism?: string;
    description?: string;
    wheelchair?: string;
    opening_hours?: string;
    historic?: string;
    wikipedia?: string;
    [key: string]: string | undefined;
  };
}

export interface NominatimPlace {
  place_id: number;
  osm_id: number;
  osm_type: string;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    amenity?: string;
    [key: string]: string | undefined;
  };
}

export interface ApiFetchState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
  source: string;
  refusedOrEmpty?: boolean;
}
