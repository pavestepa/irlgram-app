import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser } from '../api';
import type { User } from '../model';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setError(null);
      const data = await getCurrentUser();
      setUser(data);
    } catch {
      setError('Не удалось загрузить профиль');
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadUser();
    setIsRefreshing(false);
  }, [loadUser]);

  useEffect(() => {
    void (async () => {
      await loadUser();
      setIsLoading(false);
    })();
  }, [loadUser]);

  return {
    user,
    isLoading,
    isRefreshing,
    error,
    refresh,
    setUser,
  };
}
