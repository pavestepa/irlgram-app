import type { MockUpdateUserRequestJson, MockUserJson } from '@/mock/types';

import type { UpdateUserPayload, User } from '../model';

export function mapUser(json: MockUserJson): User {
  return {
    id: json.id,
    username: json.username,
    displayName: json.display_name,
    avatarUrl: json.avatar_url,
    bio: json.bio,
  };
}

export function mapUpdateUserPayload(payload: UpdateUserPayload): MockUpdateUserRequestJson {
  return {
    username: payload.username,
    display_name: payload.displayName,
    bio: payload.bio,
  };
}
