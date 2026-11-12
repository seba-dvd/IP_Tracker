/* Header.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import ThemeToggle from './ThemeToggle';

export default function Header({ children }) {
  return (
    <header className="topbar">
      {children}
      <ThemeToggle />
    </header>
  );
}
