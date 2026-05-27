import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useCurrentUserStore } from '../store/current-user-store';

export function useCurrentUser() {
  const { user, isLoading, isRefreshing, error, ensureLoaded, refresh, setUser } = useCurrentUserStore(
    useShallow((state) => ({
      user: state.user,
      isLoading: state.isLoading,
      isRefreshing: state.isRefreshing,
      error: state.error,
      ensureLoaded: state.ensureLoaded,
      refresh: state.refresh,
      setUser: state.setUser,
    })),
  );

  useEffect(() => {
    void ensureLoaded();
  }, [ensureLoaded]);

  return {
    user,
    isLoading,
    isRefreshing,
    error,
    refresh,
    setUser,
  };
}
