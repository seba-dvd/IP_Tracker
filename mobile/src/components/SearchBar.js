/* SearchBar.js - campul de cautare de 48px: iconita, textul si butonul coral, la 4px de margine (M v2.1.0) */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { radius } from '../theme';
import { useTheme } from '../ThemeContext';

export default function SearchBar({ value, onChange, onSubmit }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.field,
        { backgroundColor: colors.panel, borderColor: colors.border, boxShadow: colors.shadow },
      ]}
    >
      <Ionicons name="search-outline" size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder="IP sau domeniu, de exemplu 8.8.8.8"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="search"
        accessibilityLabel="Adresa IP sau domeniu"
        style={[styles.input, { color: colors.text }]}
      />
      <Pressable
        onPress={onSubmit}
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.buttonText, { color: colors.onAccent }]}>Cauta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 3, // 3px + bordura de 1px = 4px pana la marginea campului
    borderWidth: 1,
    borderRadius: radius.control,
  },
  input: { flex: 1, height: '100%', fontSize: 16 },
  button: { width: 88, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  buttonText: { fontSize: 15, fontWeight: '600' },
});
