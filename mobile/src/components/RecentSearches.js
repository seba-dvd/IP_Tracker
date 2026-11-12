/* RecentSearches.js - cautarile recente, ca pastile; o apasare reface cautarea (D v2.3.0) */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';

export default function RecentSearches({ items, onSelect, onClear }) {
  const { colors } = useTheme();

  return (
    <View>
      <View style={styles.head}>
        <Text style={[type.title, { color: colors.text }]}>Cautari recente</Text>
        {items.length > 0 && (
          <Pressable onPress={onClear} accessibilityRole="button" hitSlop={8}>
            <Text style={[styles.link, { color: colors.primaryText }]}>Sterge tot</Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <Text style={[type.label, { color: colors.muted }]}>Nu ai facut inca nicio cautare.</Text>
      ) : (
        <View style={styles.chips}>
          {items.map((query) => (
            <Pressable
              key={query}
              onPress={() => onSelect(query)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.chip,
                { backgroundColor: colors.primarySoft },
                pressed && styles.pressed, // usor transparenta cat timp e apasata
              ]}
            >
              <Ionicons name="refresh-outline" size={16} color={colors.primaryText} />
              <Text numberOfLines={1} style={[styles.chipText, { color: colors.text }]}>{query}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  link: { fontSize: 13, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    maxWidth: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 999, // pastila
  },
  chipText: { flexShrink: 1, fontSize: 14 },
  pressed: { opacity: 0.7 },
});
