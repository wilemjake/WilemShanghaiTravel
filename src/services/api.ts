import { LiveWeatherData, NominatimPlace, OverpassAttraction } from '../types/travel';

// Timeout helper with custom signal
function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * 1. Live weather forecast for Shanghai
 * GET https://api.open-meteo.com/v1/forecast?latitude=31.2304&longitude=121.4737&current_weather=true&hourly=temperature_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Shanghai
 */
export async function fetchLiveShanghaiWeather(): Promise<{ data: LiveWeatherData | null; error: string | null }> {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=31.2304&longitude=121.4737&current_weather=true&hourly=temperature_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Shanghai';
  try {
    const res = await fetch(url, { signal: timeoutSignal(8000) });
    if (!res.ok) {
      return { data: null, error: `Live weather service refused request with HTTP ${res.status} (${res.statusText}).` };
    }
    const data = await res.json();
    if (!data || !data.current_weather) {
      return { data: null, error: 'Live weather service responded with empty data.' };
    }
    return { data, error: null };
  } catch (err: any) {
    // Attempt fallback via backend serverless proxy if browser network failed
    try {
      const fallbackRes = await fetch('/api/ShanghaiTravel?action=weather', { signal: timeoutSignal(6000) });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return { data: fallbackData, error: null };
      }
    } catch {}
    const isTimeout = err.name === 'AbortError';
    return {
      data: null,
      error: isTimeout
        ? 'Live weather request timed out (slow upstream provider). Please refresh.'
        : `Live weather service unreachable or refused: ${err.message || 'Network error'}.`
    };
  }
}


/**
 * 3. Attractions near Bund from Overpass
 * GET https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%28%0A%20%20node%5Btourism%3Dattraction%5D%28around%3A3000%2C31.2397%2C121.4903%29%3B%0A%20%20way%5Btourism%3Dattraction%5D%28around%3A3000%2C31.2397%2C121.4903%29%3B%0A%29%3B%0Aout%20center%3B
 */
export async function fetchBundAttractions(): Promise<{ data: OverpassAttraction[] | null; error: string | null }> {
  const overpassQuery = `[out:json][timeout:25];
(
  node[tourism=attraction](around:3000,31.2397,121.4903);
  way[tourism=attraction](around:3000,31.2397,121.4903);
);
out center;`;
  const directUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  // Try direct first, then serverless proxy
  try {
    const res = await fetch(directUrl, { signal: timeoutSignal(10000) });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.elements) && json.elements.length > 0) {
        return { data: json.elements, error: null };
      }
    }
  } catch {}

  // Fallback to our project serverless function /api/ShanghaiTravel?action=bund_attractions
  try {
    const proxyRes = await fetch('/api/ShanghaiTravel?action=bund_attractions', { signal: timeoutSignal(16000) });
    if (!proxyRes.ok) {
      const errJson = await proxyRes.json().catch(() => null);
      return {
        data: null,
        error: errJson?.error || `Overpass Bund attractions refused with HTTP ${proxyRes.status} (${proxyRes.statusText}).`
      };
    }
    const json = await proxyRes.json();
    if (!json || !json.elements || json.elements.length === 0) {
      return { data: null, error: 'Overpass query returned 0 attraction elements near the Bund.' };
    }
    return { data: json.elements, error: null };
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      data: null,
      error: isTimeout
        ? 'Overpass API request timed out (server took more than 16 seconds to execute query).'
        : `Overpass API connection refused: ${err.message || 'Network unreachable'}.`
    };
  }
}

/**
 * 4. China Map via Overpass
 * GET https://overpass-api.de/api/interpreter?data=<URL-encoded Overpass QL query>
 */
export async function fetchChinaMapData(query?: string): Promise<{ data: any | null; error: string | null }> {
  const defaultQuery = query || `[out:json][timeout:25];
relation["boundary"="administrative"]["admin_level"="4"]["name:en"="Shanghai"];
out geom;`;

  try {
    const res = await fetch(`/api/ShanghaiTravel?action=china_map&query=${encodeURIComponent(defaultQuery)}`, {
      signal: timeoutSignal(16000)
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      return {
        data: null,
        error: errJson?.error || `Overpass China Map query refused with HTTP ${res.status}.`
      };
    }
    const json = await res.json();
    if (!json || !json.elements || json.elements.length === 0) {
      return { data: null, error: 'Overpass China Map query returned empty data.' };
    }
    return { data: json, error: null };
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      data: null,
      error: isTimeout
        ? 'Overpass China Map query timed out. The server is under heavy load.'
        : `Overpass China Map request refused: ${err.message || 'connection failed'}.`
    };
  }
}

/**
 * 5. Shanghai Travel Guide from Wikivoyage
 * GET https://en.wikivoyage.org/w/api.php?action=parse&page=Shanghai&prop=wikitext&format=json&formatversion=2
 */
export async function fetchShanghaiTravelGuide(): Promise<{ data: any | null; error: string | null }> {
  const directUrl = 'https://en.wikivoyage.org/w/api.php?action=parse&page=Shanghai&prop=wikitext&format=json&formatversion=2&origin=*';
  try {
    const res = await fetch(directUrl, { signal: timeoutSignal(8000) });
    if (res.ok) {
      const json = await res.json();
      if (json?.parse?.wikitext) {
        return { data: json.parse, error: null };
      }
    }
  } catch {}

  // Fallback to /api/ShanghaiTravel?action=wikivoyage
  try {
    const proxyRes = await fetch('/api/ShanghaiTravel?action=wikivoyage', { signal: timeoutSignal(10000) });
    if (!proxyRes.ok) {
      return { data: null, error: `Wikivoyage guide refused with HTTP ${proxyRes.status}.` };
    }
    const json = await proxyRes.json();
    if (!json?.parse?.wikitext) {
      return { data: null, error: 'Wikivoyage returned empty travel guide content.' };
    }
    return { data: json.parse, error: null };
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      data: null,
      error: isTimeout
        ? 'Wikivoyage travel guide request timed out.'
        : `Wikivoyage travel guide service refused: ${err.message || 'Network error'}.`
    };
  }
}

/**
 * 6. Food Guides from Nominatim
 * GET https://nominatim.openstreetmap.org/search
 */
export async function fetchNominatimFood(query = 'Shanghai restaurant'): Promise<{ data: NominatimPlace[] | null; error: string | null }> {
  try {
    const res = await fetch(`/api/ShanghaiTravel?action=food_guide&q=${encodeURIComponent(query)}`, {
      signal: timeoutSignal(10000)
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      return {
        data: null,
        error: errJson?.error || `Nominatim food guide refused with HTTP ${res.status}.`
      };
    }
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) {
      return { data: null, error: `No food places found on Nominatim for query "${query}".` };
    }
    return { data: json, error: null };
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      data: null,
      error: isTimeout
        ? 'Nominatim food guide search timed out.'
        : `Nominatim food guide service refused: ${err.message || 'connection failed'}.`
    };
  }
}
