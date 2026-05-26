import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect, useRef } from 'react';
import MapView, { Marker, type Region } from 'react-native-maps';

import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { useTheme } from '@/shared/hooks/use-theme';

import { useUserLocation } from '../hooks/use-user-location';

const REGION_DELTA = 0.01;

function toRegion(coordinate: { latitude: number; longitude: number }): Region {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: REGION_DELTA,
    longitudeDelta: REGION_DELTA,
  };
}

export function UserLocationMap() {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);
  const { location, isLoading, error } = useUserLocation();
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (!location || hasCenteredRef.current) {
      return;
    }

    mapRef.current?.animateToRegion(toRegion(location), 300);
    hasCenteredRef.current = true;
  }, [location]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <MapView ref={mapRef} style={styles.map} initialRegion={location ? toRegion(location) : undefined}>
      {location ? (
        <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.dotOuter}>
            <View style={styles.dotInner} />
          </View>
        </Marker>
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(32, 138, 239, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#208AEF',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
