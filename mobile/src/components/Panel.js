/* Panel.js - cardul aplicatiei: colturi de 16px, bordura fina si umbra moale (D v2.3.0)
   variant="primary" = card plin teal (pentru rezultat); flush = fara padding (pentru harta). */
import { StyleSheet, View } from 'react-native';
import { radius, space } from '../theme';
import { useTheme } from '../ThemeContext';

export default function Panel({ children, variant = 'default', flush = false }) {
  const { colors } = useTheme();
  const background = variant === 'primary' ? colors.primary : colors.panel;
  const border = variant === 'primary' ? colors.primary : colors.border;

  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: background, borderColor: border, boxShadow: colors.shadow },
        flush && styles.flush,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: radius.panel, padding: space.panel },
  flush: { padding: 0, overflow: 'hidden' }, // harta umple cardul, iar colturile o taie
});
