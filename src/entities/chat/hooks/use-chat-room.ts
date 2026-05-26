import { useCallback, useEffect, useRef, useState } from 'react';

import { getCurrentUser } from '@/entities/user/api';

import { connectChatSocket, getChatMessages, sendChatSocketMessage } from '../api';
import type { ChatId, ChatMessage } from '../model';

export function useChatRoom(chatId: ChatId) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seenMessageIds = useRef(new Set<string>());

  const appendMessage = useCallback((message: ChatMessage) => {
    if (seenMessageIds.current.has(message.id)) {
      return;
    }

    seenMessageIds.current.add(message.id);
    setMessages((current) => [...current, message]);
  }, []);

  useEffect(() => {
    let isMounted = true;
    seenMessageIds.current.clear();

    void (async () => {
      try {
        const [initialMessages, currentUser] = await Promise.all([
          getChatMessages(chatId),
          getCurrentUser(),
        ]);

        if (!isMounted) {
          return;
        }

        initialMessages.forEach((message) => seenMessageIds.current.add(message.id));
        setMessages(initialMessages);
        setCurrentUserId(currentUser.id);
        setError(null);
      } catch {
        if (isMounted) {
          setError('Не удалось загрузить чат');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    const disconnect = connectChatSocket(chatId, (event) => {
      if (!isMounted) {
        return;
      }

      if (event.type === 'connected') {
        setIsConnected(true);
        return;
      }

      if (event.type === 'message') {
        appendMessage(event.message);
        return;
      }

      setError(event.message);
    });

    return () => {
      isMounted = false;
      disconnect();
      setIsConnected(false);
    };
  }, [appendMessage, chatId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if (!trimmed) {
        return;
      }

      setIsSending(true);

      try {
        const message = await sendChatSocketMessage(chatId, trimmed);
        appendMessage(message);
        setError(null);
      } catch {
        setError('Не удалось отправить сообщение');
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage, chatId],
  );

  return {
    messages,
    currentUserId,
    isLoading,
    isSending,
    isConnected,
    error,
    sendMessage,
  };
}
