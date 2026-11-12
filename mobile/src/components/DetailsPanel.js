/* DetailsPanel.js - detaliile rezultatului, fiecare cu iconita lui colorata; ora locala in timp real (R v2.2.0) */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { detailFields } from '../../../shared/format';
import { useClock } from '../../../shared/useClock';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';
import Skeleton from './Skeleton';

export default function DetailsPanel({ result, loading }) {
  const { colors } = useTheme();
  const clock = useClock(result?.timezone);
  const empty = loading || !result;

  return (
    <View>
      <Text style={[type.title, styles.title, { color: colors.text }]}>Detalii</Text>
      <View style={styles.fields}>
        {detailFields(result ?? {}, clock).map((field) => {
          const tone = colors.tones[field.tone]; // { fg, bg } pentru iconita
          return (
            <View key={field.label} style={styles.field}>
              <View style={[styles.icon, { backgroundColor: tone.bg }]}>
                <Ionicons name={field.icon} size={18} color={tone.fg} />
              </View>
              <View style={styles.text}>
                <Text style={[type.label, { color: colors.muted }]}>{field.label}</Text>
                {empty ? (
                  <Skeleton />
                ) : (
                  <Text style={[type.value, field.numeric && type.numeric, { color: colors.text }]}>
                    {field.value}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: 16 },
  fields: { gap: 16 }, // 16px intre campuri
  field: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 4 }, // 4px intre eticheta si valoare
});
