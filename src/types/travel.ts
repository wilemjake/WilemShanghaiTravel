export interface TripConfig {
  startDate: string;
  endDate: string;
  adults: number;
  seniors: number;
  children: number;
  includeSuzhou: boolean;
  suzhouDate?: string; // e.g. "2026-11-03"
  includeHangzhou: boolean;
  hangzhouDate?: string; // e.g. "2026-11-02"
  pacePreference: 'gentle' | 'moderate';
}

export interface HotelStay {
  id: string;
  name: string;
  district: string;
  address: string;
  checkInDate: string;
  checkOutDate: string;
  accessibilityNotes: string;
  bookingRef?: string;
}

export interface DayCustomization {
  dayNumber: number;
  dateStr: string;
  destination: 'Shanghai' | 'Suzhou' | 'Hangzhou' | 'Custom';
  customDestinationName?: string;
  themeTitle: string;
  roughPlanNotes: string;
  morningTime: string; // e.g. "09:30"
  lunchTime: string;   // e.g. "12:30"
  afternoonTime: string; // e.g. "14:30"
  dinnerTime: string;  // e.g. "18:30"
  hotelId?: string;
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

export interface MichelinRestaurant {
  id: string;
  nameEn: string;
  nameCn: string;
  distinction: '3-Star' | '2-Star' | '1-Star' | 'Bib Gourmand' | 'Selected';
  cuisine: string;
  district: string;
  address: string;
  priceLevel: '¥' | '¥¥' | '¥¥¥' | '¥¥¥¥';
  specialties: string[];
  familySeniorTip: string;
  reservationNeeded: boolean;
  url?: string;
}
