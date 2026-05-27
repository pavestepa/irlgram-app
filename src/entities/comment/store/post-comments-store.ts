import { create } from 'zustand';

import { getUser } from '@/entities/user/api';
import type { User } from '@/entities/user';
import type { PostId } from '@/entities/post';

import {
  createComment as createCommentRequest,
  getCommentsByPostId,
  likeComment as likeCommentRequest,
  unlikeComment as unlikeCommentRequest,
} from '../api';
import { buildCommentTree } from '../model';
import type { Comment, CommentId, CommentWithReplies } from '../model';

export type CommentAuthor = Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;

type PostCommentsSlice = {
  comments: CommentWithReplies[];
  authors: Record<string, CommentAuthor>;
  replyTo: Comment | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isInitialized: boolean;
};

type PostCommentsStoreState = {
  byPostId: Record<string, PostCommentsSlice>;
  getSlice: (postId: PostId) => PostCommentsSlice;
  setSlice: (postId: PostId, patch: Partial<PostCommentsSlice>) => void;
  loadComments: (postId: PostId) => Promise<void>;
  ensureLoaded: (postId: PostId) => Promise<void>;
  submitComment: (postId: PostId, content: string) => Promise<void>;
  toggleLike: (postId: PostId, comment: Comment) => Promise<void>;
  startReply: (postId: PostId, comment: Comment) => void;
  cancelReply: (postId: PostId) => void;
  resetPost: (postId: PostId) => void;
  reset: () => void;
};

const emptySlice = (): PostCommentsSlice => ({
  comments: [],
  authors: {},
  replyTo: null,
  isLoading: true,
  isSubmitting: false,
  error: null,
  isInitialized: false,
});

export const usePostCommentsStore = create<PostCommentsStoreState>((set, get) => ({
  byPostId: {},

  getSlice: (postId) => {
    return get().byPostId[postId] ?? emptySlice();
  },

  setSlice: (postId, patch) => {
    set((state) => ({
      byPostId: {
        ...state.byPostId,
        [postId]: {
          ...(state.byPostId[postId] ?? emptySlice()),
          ...patch,
        },
      },
    }));
  },

  loadComments: async (postId) => {
    try {
      get().setSlice(postId, { error: null });
      const flatComments = await getCommentsByPostId(postId);
      const authorIds = [...new Set(flatComments.map((comment) => comment.authorId))];
      const loadedAuthors = await Promise.all(authorIds.map((authorId) => getUser(authorId)));

      get().setSlice(postId, {
        authors: Object.fromEntries(
          loadedAuthors.map((author) => [
            author.id,
            {
              id: author.id,
              username: author.username,
              displayName: author.displayName,
              avatarUrl: author.avatarUrl,
            },
          ]),
        ),
        comments: buildCommentTree(flatComments),
      });
    } catch {
      get().setSlice(postId, { error: 'Не удалось загрузить комментарии' });
    }
  },

  ensureLoaded: async (postId) => {
    const slice = get().getSlice(postId);

    if (slice.isInitialized) {
      return;
    }

    await get().loadComments(postId);
    get().setSlice(postId, { isLoading: false, isInitialized: true });
  },

  submitComment: async (postId, content) => {
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    const replyTo = get().getSlice(postId).replyTo;

    get().setSlice(postId, { isSubmitting: true });

    try {
      await createCommentRequest(postId, trimmed, replyTo?.id);
      get().setSlice(postId, { replyTo: null });
      await get().loadComments(postId);
      get().setSlice(postId, { error: null });
    } catch {
      get().setSlice(postId, { error: 'Не удалось отправить комментарий' });
    } finally {
      get().setSlice(postId, { isSubmitting: false });
    }
  },

  toggleLike: async (postId, comment) => {
    try {
      if (comment.isLikedByCurrentUser) {
        await unlikeCommentRequest(comment.id);
      } else {
        await likeCommentRequest(comment.id);
      }

      await get().loadComments(postId);
      get().setSlice(postId, { error: null });
    } catch {
      get().setSlice(postId, { error: 'Не удалось обновить лайк' });
    }
  },

  startReply: (postId, comment) => {
    get().setSlice(postId, { replyTo: comment });
  },

  cancelReply: (postId) => {
    get().setSlice(postId, { replyTo: null });
  },

  resetPost: (postId) => {
    set((state) => {
      const { [postId]: _slice, ...byPostId } = state.byPostId;
      return { byPostId };
    });
  },

  reset: () => {
    set({ byPostId: {} });
  },
}));

export type { CommentId };
