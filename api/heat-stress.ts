// Serverless function: /api/heat-stress
// Live coastal heat stress data from NEA (GET https://neaweather.com/api/heat-stress), fetched only through our project's /api/heat-stress

export default async function handler(req: any, res: any) {
  // Guardrail 1 & 4: Read keys inside api/ only.
  if (process.env.NEA_API_KEY !== undefined && process.env.NEA_API_KEY.trim() === '') {
    return res.status(503).json({ error: 'key not configured' });
  }

  res.setHeader('Content-Type', 'application/json');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://neaweather.com/api/heat-stress', {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'WilemShanghaiTravel/1.0 (Singaporean Family Itinerary Planner)',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Provider refused request with status ${response.status} (${response.statusText})`,
        source: 'https://neaweather.com/api/heat-stress',
        status: response.status
      });
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return res.status(200).json({
        data: null,
        message: 'Empty response returned from NEA coastal heat stress provider.'
      });
    }

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(200).json({ raw: text });
    }
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return res.status(504).json({
      error: isTimeout
        ? 'Request to NEA coastal heat stress timed out after 6000ms.'
        : `Network error reaching NEA heat stress endpoint: ${err.message || 'refused connection'}.`,
      source: 'https://neaweather.com/api/heat-stress'
    });
  }
}
