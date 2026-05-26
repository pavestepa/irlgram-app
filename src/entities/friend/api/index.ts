import {
  fetchFriendRequests as fetchFriendRequestsMock,
  fetchFriends as fetchFriendsMock,
} from '@/mock';

import type { Friend, FriendRequest } from '../model';
import { mapFriend, mapFriendRequest } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function getFriends(): Promise<Friend[]> {
  if (!API_BASE_URL) {
    const json = await fetchFriendsMock();
    return json.map(mapFriend);
  }

  const response = await fetch(`${API_BASE_URL}/friends`);

  if (!response.ok) {
    throw new Error('Failed to load friends');
  }

  const data = (await response.json()) as Friend[];
  return data;
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  if (!API_BASE_URL) {
    const json = await fetchFriendRequestsMock();
    return json.map(mapFriendRequest);
  }

  const response = await fetch(`${API_BASE_URL}/friends/requests`);

  if (!response.ok) {
    throw new Error('Failed to load friend requests');
  }

  const data = (await response.json()) as FriendRequest[];
  return data;
}
