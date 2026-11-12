/* Header.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import { Text, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>IP Tracker</Text>
      <ThemeToggle />
    </View>
  );
}
