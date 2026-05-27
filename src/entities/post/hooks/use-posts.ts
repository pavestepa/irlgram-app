import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { usePostsStore } from '../store/posts-store';

export function usePosts() {
  const { posts, authors, isLoading, isRefreshing, error, ensureLoaded, refresh } = usePostsStore(
    useShallow((state) => ({
      posts: state.posts,
      authors: state.authors,
      isLoading: state.isLoading,
      isRefreshing: state.isRefreshing,
      error: state.error,
      ensureLoaded: state.ensureLoaded,
      refresh: state.refresh,
    })),
  );

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  return {
    posts,
    authors,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
