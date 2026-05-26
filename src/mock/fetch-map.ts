import { getMockState } from './state';
import type { MockMapLocationJson, MockMapMarkerJson } from './types';
import { mockDelay } from './utils';

export async function fetchMapMarkers(): Promise<MockMapMarkerJson[]> {
  const state = getMockState();
  return mockDelay(
    state.mapMarkers.map((marker) => ({
      ...marker,
      location: { ...marker.location },
    })),
  );
}

export async function fetchCurrentUserMarker(): Promise<MockMapMarkerJson | null> {
  const state = getMockState();
  const marker = state.mapMarkers.find((item) => item.user_id === state.currentUserId);

  if (!marker) {
    return mockDelay(null);
  }

  return mockDelay({
    ...marker,
    location: { ...marker.location },
  });
}

export async function fetchUpdateCurrentUserLocation(
  location: MockMapLocationJson,
): Promise<MockMapMarkerJson> {
  const state = getMockState();
  const existingMarker = state.mapMarkers.find((item) => item.user_id === state.currentUserId);

  if (existingMarker) {
    existingMarker.location = { ...location };
    return mockDelay({
      ...existingMarker,
      location: { ...existingMarker.location },
    });
  }

  const marker: MockMapMarkerJson = {
    id: `marker_${state.currentUserId}`,
    user_id: state.currentUserId,
    location: { ...location },
    label: 'Я',
  };

  state.mapMarkers.push(marker);
  return mockDelay({ ...marker });
}

export async function fetchUpdateMapMarker(
  markerId: string,
  location: MockMapMarkerJson['location'],
): Promise<MockMapMarkerJson> {
  const state = getMockState();
  const marker = state.mapMarkers.find((item) => item.id === markerId);

  if (!marker) {
    return mockDelay({
      id: markerId,
      user_id: state.currentUserId,
      location: { ...location },
    });
  }

  marker.location = { ...location };
  return mockDelay({
    ...marker,
    location: { ...marker.location },
  });
}
