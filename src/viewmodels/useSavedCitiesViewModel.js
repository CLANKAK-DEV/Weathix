import { useCallback, useEffect, useState } from 'react';
import { createCity, sameCity } from '../models/CityModel';

const STORAGE_KEY = 'saved_cities';

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.map(createCity) : [];
  } catch {
    return [];
  }
}

export function useSavedCitiesViewModel() {
  const [saved, setSaved] = useState(readSaved);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch {}
  }, [saved]);

  const isSaved = useCallback(
    (city) => saved.some((c) => sameCity(c, city)),
    [saved]
  );

  const toggleSave = useCallback((city) => {
    if (!city) return;
    setSaved((prev) => {
      const exists = prev.some((c) => sameCity(c, city));
      return exists
        ? prev.filter((c) => !sameCity(c, city))
        : [...prev, createCity(city)];
    });
  }, []);

  const remove = useCallback((city) => {
    setSaved((prev) => prev.filter((c) => !sameCity(c, city)));
  }, []);

  const clear = useCallback(() => setSaved([]), []);

  return { saved, isSaved, toggleSave, remove, clear };
}
