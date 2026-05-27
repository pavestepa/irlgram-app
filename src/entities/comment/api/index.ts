import {
  fetchCommentsByPostId as fetchCommentsByPostIdMock,
  fetchCreateComment as fetchCreateCommentMock,
  fetchLikeComment as fetchLikeCommentMock,
  fetchUnlikeComment as fetchUnlikeCommentMock,
} from '@/mock';
import { getCurrentUser } from '@/entities/user/api';

import type { Comment, CommentId } from '../model';
import type { PostId } from '@/entities/post';
import { mapComment } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

async function mapComments(json: Awaited<ReturnType<typeof fetchCommentsByPostIdMock>>) {
  const currentUser = await getCurrentUser();
  return json.map((comment) => mapComment(comment, currentUser.id));
}

export async function getCommentsByPostId(postId: PostId): Promise<Comment[]> {
  if (!API_BASE_URL) {
    const json = await fetchCommentsByPostIdMock(postId);
    return mapComments(json);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error('Failed to load comments');
  }

  const data = (await response.json()) as Comment[];
  return data;
}

export async function createComment(
  postId: PostId,
  content: string,
  parentCommentId?: CommentId,
): Promise<Comment> {
  if (!API_BASE_URL) {
    const json = await fetchCreateCommentMock(postId, content, parentCommentId);
    const currentUser = await getCurrentUser();
    return mapComment(json, currentUser.id);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, parentCommentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  const data = (await response.json()) as Comment;
  return data;
}

export async function likeComment(commentId: CommentId): Promise<Comment> {
  if (!API_BASE_URL) {
    const json = await fetchLikeCommentMock(commentId);
    const currentUser = await getCurrentUser();
    return mapComment(json, currentUser.id);
  }

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to like comment');
  }

  const data = (await response.json()) as Comment;
  return data;
}

export async function unlikeComment(commentId: CommentId): Promise<Comment> {
  if (!API_BASE_URL) {
    const json = await fetchUnlikeCommentMock(commentId);
    const currentUser = await getCurrentUser();
    return mapComment(json, currentUser.id);
  }

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to unlike comment');
  }

  const data = (await response.json()) as Comment;
  return data;
}
