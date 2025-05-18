import { useState, useEffect } from 'react';

const useSystemTheme = (defaultTheme = 'light') => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return defaultTheme;
  });

  useEffect(() => {
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleThemeChange);
      };
    }
  }, []);

  return theme;
};

export default useSystemTheme;
