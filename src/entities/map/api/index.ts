import { fetchMapMarkers as fetchMapMarkersMock } from '@/mock';

import type { MapMarker } from '../model';
import { mapMapMarker } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function getMapMarkers(): Promise<MapMarker[]> {
  if (!API_BASE_URL) {
    const json = await fetchMapMarkersMock();
    return json.map(mapMapMarker);
  }

  const response = await fetch(`${API_BASE_URL}/map/markers`);

  if (!response.ok) {
    throw new Error('Failed to load map markers');
  }

  const data = (await response.json()) as MapMarker[];
  return data;
}
