import type { PostId } from '@/entities/post';
import type { UserId } from '@/entities/user';

export type CommentId = string;

export type Comment = {
  id: CommentId;
  postId: PostId;
  authorId: UserId;
  content: string;
  parentCommentId?: CommentId;
  createdAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
};

export type CommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};
