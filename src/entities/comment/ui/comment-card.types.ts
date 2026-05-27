import type { User } from '@/entities/user';

import type { CommentWithReplies } from '../model';

export type CommentAuthor = Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;

export type CommentCardProps = {
  comment: CommentWithReplies;
  author: CommentAuthor;
  authors: Record<string, CommentAuthor>;
  depth?: number;
  onLike: () => void;
  onReply: () => void;
  onReplyToChild: (comment: CommentWithReplies) => void;
  onLikeChild: (comment: CommentWithReplies) => void;
};
