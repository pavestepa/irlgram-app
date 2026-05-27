import { create } from 'zustand';

import { getCurrentUser } from '@/entities/user/api';

import { connectChatSocket, getChatMessages, sendChatSocketMessage } from '../api';
import type { ChatId, ChatMessage } from '../model';

type ChatRoomSlice = {
  messages: ChatMessage[];
  currentUserId: string | null;
  isLoading: boolean;
  isSending: boolean;
  isConnected: boolean;
  error: string | null;
};

type ChatRoomStoreState = {
  rooms: Record<string, ChatRoomSlice>;
  seenMessageIds: Record<string, Set<string>>;
  getRoom: (chatId: ChatId) => ChatRoomSlice;
  loadRoom: (chatId: ChatId) => Promise<void>;
  connectRoom: (chatId: ChatId) => () => void;
  appendMessage: (chatId: ChatId, message: ChatMessage) => void;
  sendMessage: (chatId: ChatId, text: string) => Promise<void>;
  setRoomState: (chatId: ChatId, patch: Partial<ChatRoomSlice>) => void;
  resetRoom: (chatId: ChatId) => void;
  reset: () => void;
};

const emptyRoom = (): ChatRoomSlice => ({
  messages: [],
  currentUserId: null,
  isLoading: true,
  isSending: false,
  isConnected: false,
  error: null,
});

export const useChatRoomStore = create<ChatRoomStoreState>((set, get) => ({
  rooms: {},
  seenMessageIds: {},

  getRoom: (chatId) => {
    return get().rooms[chatId] ?? emptyRoom();
  },

  setRoomState: (chatId, patch) => {
    set((state) => ({
      rooms: {
        ...state.rooms,
        [chatId]: {
          ...(state.rooms[chatId] ?? emptyRoom()),
          ...patch,
        },
      },
    }));
  },

  appendMessage: (chatId, message) => {
    const seen = get().seenMessageIds[chatId] ?? new Set<string>();

    if (seen.has(message.id)) {
      return;
    }

    seen.add(message.id);

    set((state) => {
      const room = state.rooms[chatId] ?? emptyRoom();

      return {
        seenMessageIds: {
          ...state.seenMessageIds,
          [chatId]: seen,
        },
        rooms: {
          ...state.rooms,
          [chatId]: {
            ...room,
            messages: [...room.messages, message],
          },
        },
      };
    });
  },

  loadRoom: async (chatId) => {
    get().setRoomState(chatId, { isLoading: true, error: null });

    try {
      const [initialMessages, currentUser] = await Promise.all([
        getChatMessages(chatId),
        getCurrentUser(),
      ]);

      const seen = new Set(initialMessages.map((message) => message.id));

      set((state) => ({
        seenMessageIds: {
          ...state.seenMessageIds,
          [chatId]: seen,
        },
        rooms: {
          ...state.rooms,
          [chatId]: {
            ...(state.rooms[chatId] ?? emptyRoom()),
            messages: initialMessages,
            currentUserId: currentUser.id,
            isLoading: false,
            error: null,
          },
        },
      }));
    } catch {
      get().setRoomState(chatId, {
        isLoading: false,
        error: 'Не удалось загрузить чат',
      });
    }
  },

  connectRoom: (chatId) => {
    return connectChatSocket(chatId, (event) => {
      if (event.type === 'connected') {
        get().setRoomState(chatId, { isConnected: true });
        return;
      }

      if (event.type === 'message') {
        get().appendMessage(chatId, event.message);
        return;
      }

      get().setRoomState(chatId, { error: event.message });
    });
  },

  sendMessage: async (chatId, text) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    get().setRoomState(chatId, { isSending: true });

    try {
      const message = await sendChatSocketMessage(chatId, trimmed);
      get().appendMessage(chatId, message);
      get().setRoomState(chatId, { error: null });
    } catch {
      get().setRoomState(chatId, { error: 'Не удалось отправить сообщение' });
    } finally {
      get().setRoomState(chatId, { isSending: false });
    }
  },

  resetRoom: (chatId) => {
    set((state) => {
      const { [chatId]: _room, ...rooms } = state.rooms;
      const { [chatId]: _seen, ...seenMessageIds } = state.seenMessageIds;

      return { rooms, seenMessageIds };
    });
  },

  reset: () => {
    set({ rooms: {}, seenMessageIds: {} });
  },
}));
