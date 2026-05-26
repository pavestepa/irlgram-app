import { getMockState } from './state';
import type { MockFriendJson, MockFriendRequestJson } from './types';
import { mockDelay, mockReject } from './utils';

export async function fetchFriends(): Promise<MockFriendJson[]> {
  const state = getMockState();
  return mockDelay(
    state.friends.map((friend) => ({
      ...friend,
      user: { ...friend.user },
    })),
  );
}

export async function fetchFriendRequests(): Promise<MockFriendRequestJson[]> {
  const state = getMockState();
  return mockDelay(state.friendRequests.map((request) => ({ ...request })));
}

export async function fetchAcceptFriendRequest(requestId: string): Promise<MockFriendRequestJson> {
  const state = getMockState();
  const requestIndex = state.friendRequests.findIndex((item) => item.id === requestId);

  if (requestIndex === -1) {
    return mockReject('Friend request not found', 404);
  }

  const [request] = state.friendRequests.splice(requestIndex, 1);
  const user = state.users.find((item) => item.id === request.from_user_id);

  if (user) {
    state.friends.push({
      id: `friend_${Date.now()}`,
      user: { ...user },
      since: new Date().toISOString(),
    });
  }

  return mockDelay({ ...request });
}
