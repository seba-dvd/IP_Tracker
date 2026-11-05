/* RecentSearches.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); D o inlocuieste in v2.3.0 */
export default function RecentSearches({ items, onSelect }) {
  return (
    <ul>
      {items.map((query) => (
        <li key={query}>
          <button type="button" onClick={() => onSelect(query)}>{query}</button>
        </li>
      ))}
    </ul>
  );
}
