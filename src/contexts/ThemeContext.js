import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved === 'true';
  });

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('temp_unit') || 'C';
  });

  useEffect(() => {
    localStorage.setItem('dark_mode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('temp_unit', unit);
  }, [unit]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, unit, setUnit }}>
      {children}
    </ThemeContext.Provider>
  );
};
