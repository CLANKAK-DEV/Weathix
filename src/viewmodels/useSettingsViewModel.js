import { useCallback, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const LANG_KEY = 'app_language';
const LOC_KEY = 'location_enabled';

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

export function useSettingsViewModel() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [language, setLanguage] = useState(() => read(LANG_KEY, 'en'));
  const [locationEnabled, setLocationEnabled] = useState(() => read(LOC_KEY, 'true') === 'true');

  useEffect(() => { try { localStorage.setItem(LANG_KEY, language); } catch {} }, [language]);
  useEffect(() => { try { localStorage.setItem(LOC_KEY, String(locationEnabled)); } catch {} }, [locationEnabled]);

  const toggleLocation = useCallback(() => setLocationEnabled((v) => !v), []);

  return {
    darkMode,
    toggleTheme,
    language,
    setLanguage,
    locationEnabled,
    toggleLocation,
  };
}
