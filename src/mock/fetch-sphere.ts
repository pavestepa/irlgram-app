import { getMockState } from './state';
import type { MockSphereJson } from './types';
import { mockDelay, mockReject } from './utils';

export async function fetchSpheres(): Promise<MockSphereJson[]> {
  const state = getMockState();
  return mockDelay(state.spheres.map((sphere) => ({ ...sphere })));
}

export async function fetchSphere(sphereId: string): Promise<MockSphereJson> {
  const state = getMockState();
  const sphere = state.spheres.find((item) => item.id === sphereId);

  if (!sphere) {
    return mockReject('Sphere not found', 404);
  }

  return mockDelay({ ...sphere });
}

export async function fetchJoinSphere(sphereId: string): Promise<MockSphereJson> {
  const state = getMockState();
  const sphere = state.spheres.find((item) => item.id === sphereId);

  if (!sphere) {
    return mockReject('Sphere not found', 404);
  }

  sphere.member_count += 1;
  return mockDelay({ ...sphere });
}
