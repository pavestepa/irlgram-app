import { useEffect } from 'react';

import { useChatRoomStore } from '../store/chat-room-store';
import type { ChatId } from '../model';

const emptyRoom = {
  messages: [],
  currentUserId: null,
  isLoading: true,
  isSending: false,
  isConnected: false,
  error: null,
} as const;

export function useChatRoom(chatId: ChatId) {
  const room = useChatRoomStore((state) => state.rooms[chatId] ?? emptyRoom);
  const loadRoom = useChatRoomStore((state) => state.loadRoom);
  const connectRoom = useChatRoomStore((state) => state.connectRoom);
  const sendMessageAction = useChatRoomStore((state) => state.sendMessage);
  const resetRoom = useChatRoomStore((state) => state.resetRoom);

  useEffect(() => {
    void loadRoom(chatId);
    const disconnect = connectRoom(chatId);

    return () => {
      disconnect();
      resetRoom(chatId);
    };
  }, [chatId, connectRoom, loadRoom, resetRoom]);

  return {
    messages: room.messages,
    currentUserId: room.currentUserId,
    isLoading: room.isLoading,
    isSending: room.isSending,
    isConnected: room.isConnected,
    error: room.error,
    sendMessage: (text: string) => sendMessageAction(chatId, text),
  };
}
