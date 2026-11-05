/* ResultSummary.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
import { Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function ResultSummary({ result }) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.text }}>Rezultat: {result?.ip}</Text>;
}
