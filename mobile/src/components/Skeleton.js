/* Skeleton.js - bloc afisat in locul unui text cat timp se incarca (R v2.2.0)
   onPrimary = blocul sta pe cardul teal, deci este alb translucid. */
import { View } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function Skeleton({ width = 180, height = 20, onPrimary = false }) {
  const { colors } = useTheme();
  const backgroundColor = onPrimary ? 'rgba(255, 255, 255, 0.2)' : colors.skeleton;
  return <View style={{ width, height, borderRadius: 6, backgroundColor }} />;
}
