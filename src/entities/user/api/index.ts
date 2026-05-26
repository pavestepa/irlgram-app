import type { User, UserId } from '../model';

export async function getUser(_id: UserId): Promise<User> {
  throw new Error('getUser is not implemented');
}

export async function getCurrentUser(): Promise<User> {
  throw new Error('getCurrentUser is not implemented');
}
