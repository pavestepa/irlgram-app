import type { UserId } from '@/entities/user';

export type MapLocation = {
  latitude: number;
  longitude: number;
};

export type MapMarkerId = string;

export type MapMarker = {
  id: MapMarkerId;
  userId: UserId;
  location: MapLocation;
  label?: string;
};
