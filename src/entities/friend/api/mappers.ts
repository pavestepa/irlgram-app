import type { MockFriendJson, MockFriendRequestJson } from '@/mock/types';

import { mapUser } from '@/entities/user/api/mappers';

import type { Friend, FriendRequest } from '../model';

export function mapFriend(json: MockFriendJson): Friend {
  return {
    id: json.id,
    user: mapUser(json.user),
    since: json.since,
  };
}

export function mapFriendRequest(json: MockFriendRequestJson): FriendRequest {
  return {
    id: json.id,
    fromUserId: json.from_user_id,
    toUserId: json.to_user_id,
    createdAt: json.created_at,
  };
}
