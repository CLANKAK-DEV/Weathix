export function createWeather(raw) {
  if (!raw) return null;
  return {
    current: raw.current || null,
    hourly: Array.isArray(raw.hourly) ? raw.hourly : [],
    daily: Array.isArray(raw.daily) ? raw.daily : [],
    location: raw.location || null,
    updatedAt: raw.updatedAt || Date.now(),
  };
}

export function isStale(weather, maxAgeMs = 15 * 60 * 1000) {
  if (!weather?.updatedAt) return true;
  return Date.now() - weather.updatedAt > maxAgeMs;
}

export function currentTemp(weather) {
  return weather?.current?.temperature ?? null;
}
