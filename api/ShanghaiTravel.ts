// Serverless function: /api/ShanghaiTravel
// Primary API connection for WilemShanghaiTravel (Vercel & Express)

export default async function handler(req: any, res: any) {
  // Guardrail 1 & 4: Read keys inside api/ only. Never give a key the VITE_ prefix.
  // If an expected key variable is configured but empty, return 503 "key not configured" and do not call the provider.
  if (process.env.TRAVEL_API_KEY !== undefined && process.env.TRAVEL_API_KEY.trim() === '') {
    return res.status(503).json({ error: 'key not configured' });
  }
  if (req.query && req.query.require_key === 'true' && !process.env.TRAVEL_API_KEY) {
    return res.status(503).json({ error: 'key not configured' });
  }

  res.setHeader('Content-Type', 'application/json');

  const action = req.query?.action || req.query?.type || 'overview';

  try {
    // 1. Attractions near Bund from Overpass
    if (action === 'bund_attractions') {
      const overpassQuery = `[out:json][timeout:25];
(
  node[tourism=attraction](around:3000,31.2397,121.4903);
  way[tourism=attraction](around:3000,31.2397,121.4903);
);
out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);

      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'WilemShanghaiTravel/1.0 (tehoroo@gmail.com; Singaporean Family Itinerary Planner)',
          'Accept': 'application/json, */*'
        }
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        return res.status(resp.status).json({
          error: `Overpass API refused request with HTTP ${resp.status} (${resp.statusText})`,
          source: 'https://overpass-api.de/api/interpreter',
          status: resp.status
        });
      }

      const data = await resp.json();
      return res.status(200).json(data);
    }

    // 2. China Map query via Overpass (Shanghai administrative boundary & key transit corridors)
    if (action === 'china_map') {
      const customQuery = req.query?.query || `[out:json][timeout:25];
relation["boundary"="administrative"]["admin_level"="4"]["name:en"="Shanghai"];
out geom;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(String(customQuery))}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);

      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'WilemShanghaiTravel/1.0 (tehoroo@gmail.com; Singaporean Family Itinerary Planner)',
          'Accept': 'application/json, */*'
        }
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        return res.status(resp.status).json({
          error: `Overpass API map query refused with HTTP ${resp.status} (${resp.statusText})`,
          source: 'https://overpass-api.de/api/interpreter',
          status: resp.status
        });
      }

      const data = await resp.json();
      return res.status(200).json(data);
    }

    // 3. Food guides from Nominatim
    if (action === 'food_guide') {
      const q = req.query?.q ? String(req.query.q) : 'Shanghai restaurant';
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=20&addressdetails=1`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const resp = await fetch(nominatimUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'WilemShanghaiTravel/1.0 (tehoroo@gmail.com; Singaporean Family Itinerary Planner)',
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        return res.status(resp.status).json({
          error: `Nominatim API refused food guide query with HTTP ${resp.status} (${resp.statusText})`,
          source: 'https://nominatim.openstreetmap.org/search',
          status: resp.status
        });
      }

      const data = await resp.json();
      return res.status(200).json(data);
    }

    // 4. Shanghai travel guide from Wikivoyage
    if (action === 'wikivoyage') {
      const url = 'https://en.wikivoyage.org/w/api.php?action=parse&page=Shanghai&prop=wikitext&format=json&formatversion=2';
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'WilemShanghaiTravel/1.0 (tehoroo@gmail.com; Singaporean Family Itinerary Planner)',
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        return res.status(resp.status).json({
          error: `Wikivoyage API refused request with HTTP ${resp.status} (${resp.statusText})`,
          source: 'https://en.wikivoyage.org/w/api.php',
          status: resp.status
        });
      }

      const data = await resp.json();
      return res.status(200).json(data);
    }

    // 5. Weather forecast from Open-Meteo
    if (action === 'weather') {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=31.2304&longitude=121.4737&current_weather=true&hourly=temperature_2m,precipitation_probability,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Shanghai';
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!resp.ok) {
        return res.status(resp.status).json({
          error: `Open-Meteo API refused request with HTTP ${resp.status}`,
          source: 'https://api.open-meteo.com/v1/forecast',
          status: resp.status
        });
      }

      const data = await resp.json();
      return res.status(200).json(data);
    }

    // Default overview / metadata info
    return res.status(200).json({
      service: 'WilemShanghaiTravel API',
      description: 'Serverless backend providing real-time data connections for Singaporean families planning Shanghai itineraries.',
      endpoints: {
        health: '/api/health',
        bund_attractions: '/api/ShanghaiTravel?action=bund_attractions',
        china_map: '/api/ShanghaiTravel?action=china_map',
        food_guide: '/api/ShanghaiTravel?action=food_guide',
        wikivoyage: '/api/ShanghaiTravel?action=wikivoyage',
        weather: '/api/ShanghaiTravel?action=weather'
      },
      status: 'active'
    });
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return res.status(504).json({
      error: isTimeout
        ? 'Data request timed out. The upstream server was too slow to respond.'
        : `Network error or connection refused: ${err.message || 'unknown error'}`,
      action
    });
  }
}
