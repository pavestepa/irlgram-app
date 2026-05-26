import type { UserId } from '@/entities/user';

export type PostId = string;

export type Post = {
  id: PostId;
  authorId: UserId;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
};
