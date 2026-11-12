/* RecentSearches.jsx - cautarile recente, ca pastile; un click pe una o reface (D v2.3.0) */
import { IoRefreshOutline } from 'react-icons/io5';
import './RecentSearches.css';

export default function RecentSearches({ items, onSelect, onClear }) {
  return (
    <>
      <div className="recent-head">
        <h2 className="section-title">Cautari recente</h2>
        {items.length > 0 && (
          <button type="button" className="link-btn" onClick={onClear}>Sterge tot</button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="label">Nu ai facut inca nicio cautare.</p>
      ) : (
        <ul className="recent-list">
          {items.map((query) => (
            <li key={query}>
              <button type="button" className="recent-chip" onClick={() => onSelect(query)}>
                <IoRefreshOutline aria-hidden="true" />
                <span>{query}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
