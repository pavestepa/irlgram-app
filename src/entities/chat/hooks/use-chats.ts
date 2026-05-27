import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useChatsStore } from '../store/chats-store';

export type { ChatListItem } from '../store/chats-store';

export function useChats() {
  const { items, isLoading, isRefreshing, error, ensureLoaded, refresh } = useChatsStore(
    useShallow((state) => ({
      items: state.items,
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
    items,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
