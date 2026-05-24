const ALLOWED_LAYERS = new Set([
  'precipitation_new',
  'temp_new',
  'wind_new',
  'clouds_new',
  'pressure_new',
]);

function sendJson(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function isIntegerString(value) {
  return /^\d+$/.test(String(value || ''));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return sendJson(res, 401, { error: 'OpenWeather map tiles are not configured.' });
  }

  const { layer, z, x, y } = req.query || {};
  if (!ALLOWED_LAYERS.has(layer) || !isIntegerString(z) || !isIntegerString(x) || !isIntegerString(y)) {
    return sendJson(res, 400, { error: 'Invalid weather tile request.' });
  }

  const tileUrl = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`;

  try {
    const tileResponse = await fetch(tileUrl);

    if (!tileResponse.ok) {
      return sendJson(res, tileResponse.status, { error: 'Weather tile request failed.' });
    }

    const arrayBuffer = await tileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.status(200);
    res.setHeader('Content-Type', tileResponse.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.end(buffer);
  } catch (error) {
    console.error('Weather tile proxy failed:', error);
    return sendJson(res, 500, { error: 'Weather tile service is unavailable.' });
  }
};
