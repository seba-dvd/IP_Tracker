/* App.js - ecranul aplicatiei mobile: starea cautarii, istoricul si ordinea sectiunilor
   M v2.0.0 (structura); D v2.3.0 (zona sigura, bara de stare, cardurile si spatiile)
   Ordinea din specificatie: antet, cautare, rezumat, harta, detalii, cautari recente. */
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useGeoSearch } from '../shared/useGeoSearch';
import DetailsPanel from './src/components/DetailsPanel';
import Header from './src/components/Header';
import MapPanel from './src/components/MapPanel';
import Panel from './src/components/Panel';
import RecentSearches from './src/components/RecentSearches';
import ResultSummary from './src/components/ResultSummary';
import SearchBar from './src/components/SearchBar';
import { useHistory } from './src/hooks/useHistory';
import { radius, space } from './src/theme';
import { ThemeProvider, useTheme } from './src/ThemeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Screen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Screen() {
  const { colors, isDark } = useTheme();
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
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header />
        <SearchBar value={text} onChange={setText} onSubmit={() => runSearch(text)} />
        {error ? (
          <Text style={[styles.error, { color: colors.danger, backgroundColor: colors.dangerBg }]}>{error}</Text>
        ) : null}
        <Panel variant="primary">
          <ResultSummary result={result} loading={loading} />
        </Panel>
        <Panel flush>
          <MapPanel result={result} loading={loading} />
        </Panel>
        <Panel>
          <DetailsPanel result={result} loading={loading} />
        </Panel>
        <Panel>
          <RecentSearches items={history.items} onSelect={runSearch} onClear={history.clear} />
        </Panel>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.page, gap: space.gap }, // margini si spatii de 16px
  error: { padding: 12, borderRadius: radius.control, overflow: 'hidden', fontWeight: '500' },
});
