/* RecentSearches.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); D o inlocuieste in v2.3.0 */
import { Pressable, Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function RecentSearches({ items, onSelect }) {
  const { colors } = useTheme();
  return items.map((query) => (
    <Pressable key={query} onPress={() => onSelect(query)}>
      <Text style={{ color: colors.text }}>{query}</Text>
    </Pressable>
  ));
}
