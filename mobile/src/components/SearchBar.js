/* SearchBar.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import { TextInput } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function SearchBar({ value, onChange, onSubmit }) {
  const { colors } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onSubmit}
      placeholder="Adresa IP sau domeniu"
      placeholderTextColor={colors.muted}
      autoCapitalize="none"
      style={{ height: 48, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingHorizontal: 14 }}
    />
  );
}
