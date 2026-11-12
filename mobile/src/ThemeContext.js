/* ThemeContext.js - tema aplicatiei: urmeaza telefonul pana cand utilizatorul alege una
   M v2.0.0 (schelet), M v2.1.0 (butonul de tema si salvarea alegerii in AsyncStorage) */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './theme';

const KEY = 'geo-theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme(); // tema telefonului: 'light' sau 'dark'
  const [choice, setChoice] = useState(null); // tema aleasa de utilizator; null = cea a telefonului

  // la pornire citim alegerea salvata (AsyncStorage raspunde asincron, printr-un Promise)
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setChoice(saved);
    });
  }, []);

  const scheme = choice ?? (system === 'dark' ? 'dark' : 'light');

  function toggleTheme() {
    const next = scheme === 'dark' ? 'light' : 'dark';
    setChoice(next);
    AsyncStorage.setItem(KEY, next);
  }

  const value = { colors: colors[scheme], isDark: scheme === 'dark', toggleTheme };
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

// in componente: const { colors, isDark, toggleTheme } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
