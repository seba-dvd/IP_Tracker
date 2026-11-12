/* Header.jsx - antetul: logo, bara de cautare (primita ca children) si butonul de tema
   M v2.1.0 */
import { IoGlobeOutline } from 'react-icons/io5';
import ThemeToggle from './ThemeToggle';
import './Header.css';

export default function Header({ children }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true">
          <IoGlobeOutline />
        </span>
        <h1 className="brand-name">IP Tracker</h1>
      </div>
      {children}
      <ThemeToggle />
    </header>
  );
}
