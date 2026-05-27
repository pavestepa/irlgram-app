import { useEffect } from 'react';

import type { PostId } from '@/entities/post';

import { usePostCommentsStore } from '../store/post-comments-store';
import type { Comment, CommentId } from '../model';

export type { CommentAuthor } from '../store/post-comments-store';

const emptySlice = {
  comments: [],
  authors: {},
  replyTo: null,
  isLoading: true,
  isSubmitting: false,
  error: null,
} as const;

export function usePostComments(postId: PostId) {
  const slice = usePostCommentsStore((state) => state.byPostId[postId] ?? emptySlice);
  const ensureLoaded = usePostCommentsStore((state) => state.ensureLoaded);
  const submitComment = usePostCommentsStore((state) => state.submitComment);
  const toggleLike = usePostCommentsStore((state) => state.toggleLike);
  const startReply = usePostCommentsStore((state) => state.startReply);
  const cancelReply = usePostCommentsStore((state) => state.cancelReply);

  useEffect(() => {
    void ensureLoaded(postId);
  }, [ensureLoaded, postId]);

  return {
    comments: slice.comments,
    authors: slice.authors,
    replyTo: slice.replyTo,
    isLoading: slice.isLoading,
    isSubmitting: slice.isSubmitting,
    error: slice.error,
    submitComment: (content: string) => submitComment(postId, content),
    toggleLike: (comment: Comment) => toggleLike(postId, comment),
    startReply: (comment: Comment) => startReply(postId, comment),
    cancelReply: () => cancelReply(postId),
  };
}

export type { CommentId };
