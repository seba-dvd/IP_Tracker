/* ResultSummary.js - cardul cu rezultatul: adresa IP si locatia, pe fundalul teal (R v2.2.0)
   Fundalul teal il pune App.js, prin <Panel variant="primary"> (D). */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { formatLocation } from '../../../shared/format';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';
import Skeleton from './Skeleton';

export default function ResultSummary({ result, loading }) {
  const { colors } = useTheme();
  const empty = loading || !result; // fara date de afisat: blocuri translucide

  return (
    <View style={styles.row}>
      <View style={styles.lines}>
        <Text style={[styles.label, { color: colors.onPrimaryMuted }]}>Rezultat</Text>
        {empty ? (
          <Skeleton width={160} height={30} onPrimary />
        ) : (
          <Text style={[styles.ip, type.numeric, { color: colors.onPrimary }]}>{result.ip}</Text>
        )}
        {empty ? (
          <Skeleton width={200} onPrimary />
        ) : (
          <Text style={[type.value, { color: colors.onPrimaryMuted }]}>{formatLocation(result)}</Text>
        )}
      </View>
      <View style={styles.icon}>
        <Ionicons name="globe-outline" size={20} color={colors.onPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  lines: { flex: 1, gap: 4 },
  label: { fontSize: 13, fontWeight: '500' },
  ip: { fontSize: 24, fontWeight: '600' },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
});

