import {
  fetchCurrentUser as fetchCurrentUserMock,
  fetchUpdateCurrentUser as fetchUpdateCurrentUserMock,
  fetchUser as fetchUserMock,
} from '@/mock';

import type { UpdateUserPayload, User, UserId } from '../model';
import { mapUpdateUserPayload, mapUser } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function getUser(id: UserId): Promise<User> {
  if (!API_BASE_URL) {
    const json = await fetchUserMock(id);
    return mapUser(json);
  }

  const response = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error('Failed to load user');
  }

  const data = (await response.json()) as User;
  return data;
}

export async function getCurrentUser(): Promise<User> {
  if (!API_BASE_URL) {
    const json = await fetchCurrentUserMock();
    return mapUser(json);
  }

  const response = await fetch(`${API_BASE_URL}/users/me`);

  if (!response.ok) {
    throw new Error('Failed to load current user');
  }

  const data = (await response.json()) as User;
  return data;
}

export async function updateCurrentUser(payload: UpdateUserPayload): Promise<User> {
  if (!API_BASE_URL) {
    const json = await fetchUpdateCurrentUserMock(mapUpdateUserPayload(payload));
    return mapUser(json);
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  const data = (await response.json()) as User;
  return data;
}
