import { getMockState } from './state';
import type { MockCommentJson } from './types';
import { mockDelay, mockReject } from './utils';

function findPost(postId: string) {
  const state = getMockState();
  return state.posts.find((item) => item.id === postId);
}

function findComment(commentId: string) {
  const state = getMockState();
  return state.comments.find((item) => item.id === commentId);
}

function incrementPostCommentCount(postId: string) {
  const post = findPost(postId);

  if (post) {
    post.comment_count += 1;
  }
}

export async function fetchCommentsByPostId(postId: string): Promise<MockCommentJson[]> {
  const state = getMockState();
  const post = findPost(postId);

  if (!post) {
    return mockReject('Post not found', 404);
  }

  return mockDelay(
    state.comments
      .filter((comment) => comment.post_id === postId)
      .map((comment) => ({
        ...comment,
        liked_by_user_ids: [...comment.liked_by_user_ids],
      })),
  );
}

export async function fetchCreateComment(
  postId: string,
  content: string,
  parentCommentId?: string,
): Promise<MockCommentJson> {
  const state = getMockState();
  const post = findPost(postId);

  if (!post) {
    return mockReject('Post not found', 404);
  }

  if (parentCommentId) {
    const parentComment = findComment(parentCommentId);

    if (!parentComment || parentComment.post_id !== postId) {
      return mockReject('Parent comment not found', 404);
    }
  }

  const comment: MockCommentJson = {
    id: `comment_${Date.now()}`,
    post_id: postId,
    author_id: state.currentUserId,
    content,
    parent_comment_id: parentCommentId,
    created_at: new Date().toISOString(),
    like_count: 0,
    liked_by_user_ids: [],
  };

  state.comments.push(comment);
  incrementPostCommentCount(postId);

  return mockDelay({ ...comment, liked_by_user_ids: [] });
}

export async function fetchLikeComment(commentId: string): Promise<MockCommentJson> {
  const state = getMockState();
  const comment = findComment(commentId);

  if (!comment) {
    return mockReject('Comment not found', 404);
  }

  if (!comment.liked_by_user_ids.includes(state.currentUserId)) {
    comment.liked_by_user_ids.push(state.currentUserId);
    comment.like_count += 1;
  }

  return mockDelay({
    ...comment,
    liked_by_user_ids: [...comment.liked_by_user_ids],
  });
}

export async function fetchUnlikeComment(commentId: string): Promise<MockCommentJson> {
  const state = getMockState();
  const comment = findComment(commentId);

  if (!comment) {
    return mockReject('Comment not found', 404);
  }

  const likedIndex = comment.liked_by_user_ids.indexOf(state.currentUserId);

  if (likedIndex >= 0) {
    comment.liked_by_user_ids.splice(likedIndex, 1);
    comment.like_count = Math.max(0, comment.like_count - 1);
  }

  return mockDelay({
    ...comment,
    liked_by_user_ids: [...comment.liked_by_user_ids],
  });
}
