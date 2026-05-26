import { useCallback, useEffect, useState } from 'react';

import { getCurrentUser, getUser } from '@/entities/user/api';
import type { User } from '@/entities/user';

import { getChats } from '../api';
import type { Chat } from '../model';

export type ChatListItem = {
  chat: Chat;
  peer: Pick<User, 'id' | 'displayName' | 'username'>;
};

export function useChats() {
  const [items, setItems] = useState<ChatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChats = useCallback(async () => {
    try {
      setError(null);
      const [chats, currentUser] = await Promise.all([getChats(), getCurrentUser()]);
      const mapped = await Promise.all(
        chats.map(async (chat) => {
          const peerId = chat.participantIds.find((id) => id !== currentUser.id);

          if (!peerId) {
            return null;
          }

          const peer = await getUser(peerId);

          return {
            chat,
            peer: {
              id: peer.id,
              displayName: peer.displayName,
              username: peer.username,
            },
          } satisfies ChatListItem;
        }),
      );

      setItems(mapped.filter((item): item is ChatListItem => item !== null));
    } catch {
      setError('Не удалось загрузить чаты');
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadChats();
    setIsRefreshing(false);
  }, [loadChats]);

  useEffect(() => {
    void (async () => {
      await loadChats();
      setIsLoading(false);
    })();
  }, [loadChats]);

  return {
    items,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
