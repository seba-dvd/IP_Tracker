/* Header.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import { Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function Header() {
  const { colors } = useTheme();
  return <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>IP Tracker</Text>;
}
