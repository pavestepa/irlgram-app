import { fetchSphere as fetchSphereMock, fetchSpheres as fetchSpheresMock } from '@/mock';

import type { Sphere, SphereId } from '../model';
import { mapSphere } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function getSphere(id: SphereId): Promise<Sphere> {
  if (!API_BASE_URL) {
    const json = await fetchSphereMock(id);
    return mapSphere(json);
  }

  const response = await fetch(`${API_BASE_URL}/spheres/${id}`);

  if (!response.ok) {
    throw new Error('Failed to load sphere');
  }

  const data = (await response.json()) as Sphere;
  return data;
}

export async function getSpheres(): Promise<Sphere[]> {
  if (!API_BASE_URL) {
    const json = await fetchSpheresMock();
    return json.map(mapSphere);
  }

  const response = await fetch(`${API_BASE_URL}/spheres`);

  if (!response.ok) {
    throw new Error('Failed to load spheres');
  }

  const data = (await response.json()) as Sphere[];
  return data;
}
