import { create } from 'zustand';

import { getCurrentUser, getUser } from '@/entities/user/api';
import type { User } from '@/entities/user';

import { getChats } from '../api';
import type { Chat } from '../model';

export type ChatListItem = {
  chat: Chat;
  peer: Pick<User, 'id' | 'displayName' | 'username'>;
};

type ChatsStoreState = {
  items: ChatListItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isInitialized: boolean;
  loadChats: () => Promise<void>;
  refresh: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
  reset: () => void;
};

const initialState = {
  items: [] as ChatListItem[],
  isLoading: true,
  isRefreshing: false,
  error: null as string | null,
  isInitialized: false,
};

export const useChatsStore = create<ChatsStoreState>((set, get) => ({
  ...initialState,

  loadChats: async () => {
    try {
      set({ error: null });
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

      set({ items: mapped.filter((item): item is ChatListItem => item !== null) });
    } catch {
      set({ error: 'Не удалось загрузить чаты' });
    }
  },

  refresh: async () => {
    set({ isRefreshing: true });
    await get().loadChats();
    set({ isRefreshing: false });
  },

  ensureLoaded: async () => {
    if (get().isInitialized) {
      return;
    }

    await get().loadChats();
    set({ isLoading: false, isInitialized: true });
  },

  reset: () => {
    set({ ...initialState, isLoading: false, isInitialized: false });
  },
}));
