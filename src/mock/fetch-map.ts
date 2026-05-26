import { getMockState } from './state';
import type { MockMapMarkerJson } from './types';
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
