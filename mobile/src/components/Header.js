/* Header.js - antetul aplicatiei mobile: logo-ul in stanga, butonul de tema in dreapta (M v2.1.0) */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Ionicons name="globe-outline" size={20} color={colors.onPrimary} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>IP Tracker</Text>
      </View>
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '600' },
});
