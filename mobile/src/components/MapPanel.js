/* MapPanel.js - harta cu locatia aproximativa a IP-ului (R v2.2.0)
   react-native-maps foloseste Google Maps pe Android si Apple Maps pe iOS; este inclus in Expo Go. */
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';

const WORLD = { latitude: 20, longitude: 0, latitudeDelta: 100, longitudeDelta: 100 };
const CITY_ZOOM = { latitudeDelta: 0.2, longitudeDelta: 0.2 }; // cat de mult se apropie harta

// stil intunecat pentru Google Maps (Android); pe iOS tema se alege cu userInterfaceStyle
const DARK_MAP = [
  { elementType: 'geometry', stylers: [{ color: '#1d2329' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9aa5b4' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1d2329' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b333d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1a26' }] },
];

export default function MapPanel({ result, loading }) {
  const { colors, isDark } = useTheme();
  const mapRef = useRef(null); // acces direct la harta, pentru animateToRegion
  const [ready, setReady] = useState(false); // harta s-a incarcat si poate fi mutata
  const lat = result?.latitude;
  const lon = result?.longitude;

  // la fiecare rezultat nou, harta se muta animat la locatie
  useEffect(() => {
    if (ready && lat != null && lon != null) {
      mapRef.current?.animateToRegion({ latitude: lat, longitude: lon, ...CITY_ZOOM }, 1200);
    }
  }, [ready, lat, lon]);

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={WORLD}
        onMapReady={() => setReady(true)}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
        customMapStyle={isDark ? DARK_MAP : []}
      >
        {result && (
          <Marker coordinate={{ latitude: lat, longitude: lon }} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.halo, { backgroundColor: colors.accentSoft }]}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            </View>
          </Marker>
        )}
      </MapView>
      <View style={[styles.caption, { backgroundColor: colors.panel, boxShadow: colors.shadow }]}>
        <Ionicons name="location" size={14} color={colors.accent} />
        <Text style={[type.label, { color: colors.muted }]}>Locatie aproximativa a IP-ului</Text>
      </View>
      {loading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={colors.primaryText} />}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 280 },
  caption: {
    position: 'absolute', // pastila sta peste harta, in stanga sus
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  halo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#FFFFFF' },
});

