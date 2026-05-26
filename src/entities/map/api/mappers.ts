import type { MockMapLocationJson, MockMapMarkerJson } from '@/mock/types';

import type { MapLocation, MapMarker } from '../model';

export function mapMapLocationToJson(location: MapLocation): MockMapLocationJson {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

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
