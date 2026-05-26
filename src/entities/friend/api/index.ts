import type { Friend, FriendRequest } from '../model';

export async function getFriends(): Promise<Friend[]> {
  throw new Error('getFriends is not implemented');
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  throw new Error('getFriendRequests is not implemented');
}
