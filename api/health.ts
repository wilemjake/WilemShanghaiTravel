// Serverless function: /api/health
// Deployment target: Vercel & Express dev server

export default async function handler(req: any, res: any) {
  // Guardrail 1 & 4: Read keys inside api/ only. If a key variable is empty, return 503 "key not configured"
  if (process.env.TRAVEL_API_KEY !== undefined && process.env.TRAVEL_API_KEY.trim() === '') {
    return res.status(503).json({ error: 'key not configured' });
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    service: 'WilemShanghaiTravel',
    uptime: process.uptime ? process.uptime() : 0,
    timestamp: new Date().toISOString()
  });
}
