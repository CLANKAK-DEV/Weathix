import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeatherData } from '../services/weatherService';
import { getIpLocation } from '../services/geoService';
import { createWeather } from '../models/WeatherModel';

export function useWeatherViewModel(initialCity) {
  const [city, setCity] = useState(initialCity || null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const load = useCallback(async (target) => {
    if (!target?.lat || !target?.lon) return;
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const raw = await getWeatherData(target.lat, target.lon);
      if (id !== requestId.current) return;
      if (!raw) throw new Error('No weather data');
      setWeather(createWeather({ ...raw, location: target }));
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message || 'Failed to load weather');
      setWeather(null);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => { if (city) load(city); }, [city, load]);

  const selectCity = useCallback((next) => setCity(next), []);
  const refresh = useCallback(() => city && load(city), [city, load]);

  const locateByIp = useCallback(async () => {
    setLoading(true);
    try {
      const loc = await getIpLocation();
      if (loc) setCity(loc);
      return loc;
    } finally {
      setLoading(false);
    }
  }, []);

  return { city, weather, loading, error, selectCity, refresh, locateByIp };
}
