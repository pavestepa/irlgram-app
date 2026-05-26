import type { MockPostJson } from '@/mock/types';

import type { Post } from '../model';

export function mapPost(json: MockPostJson): Post {
  return {
    id: json.id,
    authorId: json.author_id,
    content: json.content,
    imageUrl: json.image_url,
    createdAt: json.created_at,
    likeCount: json.like_count,
    commentCount: json.comment_count,
  };
}
