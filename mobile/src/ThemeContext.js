/* ThemeContext.js - culorile temei, disponibile in toata aplicatia (M v2.0.0)
   In schelet urmeaza tema telefonului; M adauga butonul si salvarea alegerii in v2.1.0. */
import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const value = { colors: colors[scheme], isDark: scheme === 'dark', toggleTheme: () => {} };
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

// in componente: const { colors, isDark, toggleTheme } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
