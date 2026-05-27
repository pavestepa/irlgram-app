import type { MockCommentJson } from '@/mock/types';

import type { Comment } from '../model';

export function mapComment(json: MockCommentJson, currentUserId: string): Comment {
  return {
    id: json.id,
    postId: json.post_id,
    authorId: json.author_id,
    content: json.content,
    parentCommentId: json.parent_comment_id,
    createdAt: json.created_at,
    likeCount: json.like_count,
    isLikedByCurrentUser: json.liked_by_user_ids.includes(currentUserId),
  };
}
