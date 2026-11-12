/* useTheme.js - tema luminoasa sau intunecata, salvata in localStorage (M v2.1.0)
   Tema de pornire este pusa pe <html> de scriptul din index.html, inainte sa porneasca React. */
import { useEffect, useState } from 'react';

const KEY = 'geo-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  // la fiecare schimbare actualizam atributul de pe <html>; variabilele CSS fac restul
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // stocarea poate fi blocata; tema se schimba oricum, doar nu se mai tine minte
    }
  }

  return { theme, toggleTheme };
}
