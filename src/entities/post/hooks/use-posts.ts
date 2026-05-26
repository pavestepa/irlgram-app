import { useCallback, useEffect, useState } from 'react';

import { getUser } from '@/entities/user/api';
import type { User } from '@/entities/user';

import { getPosts } from '../api';
import type { Post } from '../model';
import type { PostAuthor } from '../ui/post-card.types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAuthors = useCallback(async (postsList: Post[]) => {
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
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      const postsList = await getPosts();
      const authorsMap = await loadAuthors(postsList);
      setPosts(postsList);
      setAuthors(authorsMap);
    } catch {
      setError('Не удалось загрузить посты');
    }
  }, [loadAuthors]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  }, [loadPosts]);

  useEffect(() => {
    void (async () => {
      await loadPosts();
      setIsLoading(false);
    })();
  }, [loadPosts]);

  return {
    posts,
    authors,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
