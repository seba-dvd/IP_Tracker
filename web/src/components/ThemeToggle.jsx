/* ThemeToggle.jsx - butonul de 44x44 care comuta tema (M v2.1.0) */
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Tema intunecata"
      aria-pressed={isDark}
    >
      {isDark ? <IoMoonOutline aria-hidden="true" /> : <IoSunnyOutline aria-hidden="true" />}
    </button>
  );
}
