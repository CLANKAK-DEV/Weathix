import { useCallback, useEffect, useRef, useState } from 'react';
import { searchCities } from '../services/weatherService';
import { createCity } from '../models/CityModel';

export function useSearchViewModel(debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  const lastQuery = useRef('');

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = query.trim();
    if (q.length < 2) { setResults([]); setLoading(false); return; }

    setLoading(true);
    timer.current = setTimeout(async () => {
      lastQuery.current = q;
      const matches = await searchCities(q);
      if (lastQuery.current !== q) return;
      setResults((matches || []).map(createCity));
      setLoading(false);
    }, debounceMs);

    return () => clearTimeout(timer.current);
  }, [query, debounceMs]);

  const clear = useCallback(() => { setQuery(''); setResults([]); }, []);

  return { query, setQuery, results, loading, clear };
}
