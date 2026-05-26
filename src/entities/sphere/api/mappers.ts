import type { MockSphereJson } from '@/mock/types';

import type { Sphere } from '../model';

export function mapSphere(json: MockSphereJson): Sphere {
  return {
    id: json.id,
    name: json.name,
    description: json.description,
    memberCount: json.member_count,
    coverUrl: json.cover_url,
  };
}
