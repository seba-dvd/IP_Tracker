/* ThemeToggle.js - butonul de 44x44 care comuta tema (M v2.1.0) */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { radius } from '../theme';
import { useTheme } from '../ThemeContext';

export default function ThemeToggle() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="switch"
      accessibilityLabel="Tema intunecata"
      accessibilityState={{ checked: isDark }}
      style={[
        styles.button,
        { backgroundColor: colors.panel, borderColor: colors.border, boxShadow: colors.shadow },
      ]}
    >
      <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.control,
  },
});
