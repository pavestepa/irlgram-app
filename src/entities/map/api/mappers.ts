import type { MockMapMarkerJson } from '@/mock/types';

import type { MapMarker } from '../model';

export function mapMapMarker(json: MockMapMarkerJson): MapMarker {
  return {
    id: json.id,
    userId: json.user_id,
    location: {
      latitude: json.location.latitude,
      longitude: json.location.longitude,
    },
    label: json.label,
  };
}
