import * as Location from 'expo-location';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { getCurrentUserMarker, updateUserLocation } from '../api';
import { requestCurrentLocation } from '../api/location-access';
import { useLocationStore } from '../store/location-store';
import type { MapLocation } from '../model';

const WATCH_DISTANCE_METERS = 10;

export function useUserLocation() {
  const { location, isLoading, error, setLocation, setLoading, setError } = useLocationStore(
    useShallow((state) => ({
      location: state.location,
      isLoading: state.isLoading,
      error: state.error,
      setLocation: state.setLocation,
      setLoading: state.setLoading,
      setError: state.setError,
    })),
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;

    const applyLocation = (next: MapLocation) => {
      if (!isMounted) {
        return;
      }

      setLocation(next);
      void updateUserLocation(next);
    };

    void (async () => {
      try {
        const storedMarker = await getCurrentUserMarker();

        if (storedMarker && isMounted) {
          setLocation(storedMarker.location);
        }

        const current = await requestCurrentLocation();

        if (!isMounted) {
          return;
        }

        if (current) {
          applyLocation(current);
        } else if (!storedMarker) {
          setError('Нет доступа к геолокации');
        }
      } catch {
        if (isMounted) {
          setError('Не удалось определить местоположение');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }

      const permission = await Location.getForegroundPermissionsAsync();

      if (permission.status !== 'granted' || !isMounted) {
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: WATCH_DISTANCE_METERS,
        },
        (position) => {
          applyLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
      );
    })();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [setError, setLoading, setLocation]);

  return {
    location,
    isLoading,
    error,
  };
}
