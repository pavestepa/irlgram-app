import { findMockUser, getMockState } from './state';
import type { MockUpdateUserRequestJson, MockUserJson } from './types';
import { MOCK_UPDATE_USER_DELAY_MS } from './types';
import { mockDelay, mockDelayMs, mockReject } from './utils';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export async function fetchCurrentUser(): Promise<MockUserJson> {
  const state = getMockState();
  const user = findMockUser(state.currentUserId);

  if (!user) {
    return mockReject('Current user not found', 404);
  }

  return mockDelay({ ...user });
}

export async function fetchUser(userId: string): Promise<MockUserJson> {
  const user = findMockUser(userId);

  if (!user) {
    return mockReject('User not found', 404);
  }

  return mockDelay({ ...user });
}

export async function fetchUsers(): Promise<MockUserJson[]> {
  const state = getMockState();
  return mockDelay(state.users.map((user) => ({ ...user })));
}

export async function fetchUpdateCurrentUser(
  body: MockUpdateUserRequestJson,
): Promise<MockUserJson> {
  const state = getMockState();
  const user = findMockUser(state.currentUserId);

  if (!user) {
    return mockReject('Current user not found', 404);
  }

  if (body.username !== undefined) {
    if (!body.username.trim()) {
      return mockReject('Username is required', 400);
    }

    if (!USERNAME_REGEX.test(body.username)) {
      return mockReject('Invalid username', 400);
    }

    user.username = body.username;
  }

  if (body.display_name !== undefined) {
    user.display_name = body.display_name.trim();
  }

  if (body.bio !== undefined) {
    user.bio = body.bio.trim();
  }

  return mockDelayMs({ ...user }, MOCK_UPDATE_USER_DELAY_MS);
}
