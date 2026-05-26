import { fetchUpdateCurrentUserLocation } from '@/mock';

import type { MapLocation } from '../model';
import { mapMapLocationToJson, mapMapMarker } from './mappers';
import { requestCurrentLocation } from './location-access';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function updateUserLocation(location: MapLocation) {
  if (!API_BASE_URL) {
    const json = await fetchUpdateCurrentUserLocation(mapMapLocationToJson(location));
    return mapMapMarker(json);
  }

  const response = await fetch(`${API_BASE_URL}/map/me/location`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(location),
  });

  if (!response.ok) {
    throw new Error('Failed to update user location');
  }

  const data = (await response.json()) as Awaited<ReturnType<typeof mapMapMarker>>;
  return data;
}

export async function syncUserLocationOnAuth(): Promise<MapLocation | null> {
  const location = await requestCurrentLocation();

  if (!location) {
    return null;
  }

  await updateUserLocation(location);
  return location;
}
