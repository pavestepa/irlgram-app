export type UserId = string;

export type User = {
  id: UserId;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
};

export type UpdateUserPayload = {
  username?: string;
  displayName?: string;
  bio?: string;
};
