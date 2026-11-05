/* App.jsx - leaga componentele: starea cautarii, istoricul si ordinea din pagina
   M v2.0.0 (structura); asezarea in pagina este in App.css (D v2.3.0) */
import { useState } from 'react';
import { useGeoSearch } from '../../shared/useGeoSearch';
import DetailsPanel from './components/DetailsPanel';
import Header from './components/Header';
import MapPanel from './components/MapPanel';
import RecentSearches from './components/RecentSearches';
import ResultSummary from './components/ResultSummary';
import SearchBar from './components/SearchBar';
import { useHistory } from './hooks/useHistory';
import './App.css';

export default function App() {
  const { result, error, loading, search } = useGeoSearch();
  const history = useHistory();
  const [text, setText] = useState(''); // textul din bara de cautare

  // cauta textul dat; daca reuseste, il pune primul in istoric
  async function runSearch(query) {
    setText(query);
    const ok = await search(query);
    if (ok && query.trim()) history.add(query.trim());
  }

  return (
    <div className="app">
      <Header>
        <SearchBar value={text} onChange={setText} onSubmit={() => runSearch(text)} />
      </Header>

      {error && <p className="error" role="alert">{error}</p>}

      <main className="layout" aria-busy={loading}>
        <section className="map-panel" aria-label="Harta">
          <MapPanel result={result} loading={loading} />
        </section>
        <div className="sidebar">
          <section className="section summary" aria-label="Rezultat">
            <ResultSummary result={result} loading={loading} />
          </section>
          <section className="section details" aria-label="Detalii">
            <DetailsPanel result={result} loading={loading} />
          </section>
          <section className="section recent" aria-label="Cautari recente">
            <RecentSearches items={history.items} onSelect={runSearch} onClear={history.clear} />
          </section>
        </div>
      </main>
    </div>
  );
}
