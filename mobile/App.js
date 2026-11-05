/* App.js - ecranul aplicatiei mobile: starea cautarii, istoricul si ordinea sectiunilor
   M v2.0.0 (structura); asezarea si stilurile: D v2.3.0 */
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useGeoSearch } from '../shared/useGeoSearch';
import DetailsPanel from './src/components/DetailsPanel';
import Header from './src/components/Header';
import MapPanel from './src/components/MapPanel';
import RecentSearches from './src/components/RecentSearches';
import ResultSummary from './src/components/ResultSummary';
import SearchBar from './src/components/SearchBar';
import { useHistory } from './src/hooks/useHistory';
import { ThemeProvider, useTheme } from './src/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
}

function Screen() {
  const { colors } = useTheme();
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
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
      <Header />
      <SearchBar value={text} onChange={setText} onSubmit={() => runSearch(text)} />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <ResultSummary result={result} loading={loading} />
      <MapPanel result={result} loading={loading} />
      <DetailsPanel result={result} loading={loading} />
      <RecentSearches items={history.items} onSelect={runSearch} onClear={history.clear} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingTop: 56, gap: 16 },
});
