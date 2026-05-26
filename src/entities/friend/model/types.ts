import type { User, UserId } from '@/entities/user';

export type FriendId = string;

export type Friend = {
  id: FriendId;
  user: User;
  since: string;
};

export type FriendRequest = {
  id: string;
  fromUserId: UserId;
  toUserId: UserId;
  createdAt: string;
};
