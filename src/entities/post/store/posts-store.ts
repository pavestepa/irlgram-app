import { create } from 'zustand';

import { getUser } from '@/entities/user/api';
import type { User } from '@/entities/user';

import { getPosts } from '../api';
import type { Post } from '../model';
import type { PostAuthor } from '../ui/post-card.types';

type PostsStoreState = {
  posts: Post[];
  authors: Record<string, PostAuthor>;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isInitialized: boolean;
  loadPosts: () => Promise<void>;
  refresh: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
  reset: () => void;
};

const initialState = {
  posts: [] as Post[],
  authors: {} as Record<string, PostAuthor>,
  isLoading: true,
  isRefreshing: false,
  error: null as string | null,
  isInitialized: false,
};

async function loadAuthors(postsList: Post[]) {
  const authorIds = [...new Set(postsList.map((post) => post.authorId))];
  const users = await Promise.all(authorIds.map((id) => getUser(id)));

  return users.reduce<Record<string, PostAuthor>>((acc, user: User) => {
    acc[user.id] = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };
    return acc;
  }, {});
}

export const usePostsStore = create<PostsStoreState>((set, get) => ({
  ...initialState,

  loadPosts: async () => {
    try {
      set({ error: null });
      const postsList = await getPosts();
      const authorsMap = await loadAuthors(postsList);
      set({ posts: postsList, authors: authorsMap });
    } catch {
      set({ error: 'Не удалось загрузить посты' });
    }
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await get().loadPosts();
    set({ isRefreshing: false });
  },

  ensureLoaded: async () => {
    if (get().isInitialized) {
      return;
    }

    await get().loadPosts();
    set({ isLoading: false, isInitialized: true });
  },

  reset: () => {
    set({ ...initialState, isLoading: false, isInitialized: false });
  },
}));
