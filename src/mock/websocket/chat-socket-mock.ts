import type { MockChatMessageJson } from '../types';
import { fetchSendChatMessage } from '../fetch-chat';
import { findMockUser, getMockState } from '../state';

export type ChatSocketEvent =
  | { type: 'connected'; chat_id: string }
  | { type: 'message'; payload: MockChatMessageJson }
  | { type: 'error'; message: string };

type ChatSocketHandler = (event: ChatSocketEvent) => void;

const subscribers = new Map<string, Set<ChatSocketHandler>>();
const autoReplyTimers = new Map<string, ReturnType<typeof setInterval>>();

const AUTO_REPLY_MESSAGES = [
  'Понял 👍',
  'Супер!',
  'Давай позже обсудим',
  'Ок, спасибо',
];

function emit(chatId: string, event: ChatSocketEvent) {
  const handlers = subscribers.get(chatId);

  if (!handlers) {
    return;
  }

  handlers.forEach((handler) => handler(event));
}

function getOtherParticipantId(chatId: string) {
  const state = getMockState();
  const chat = state.chats.find((item) => item.id === chatId);

  if (!chat) {
    return null;
  }

  return chat.participant_ids.find((id) => id !== state.currentUserId) ?? null;
}

function scheduleAutoReply(chatId: string) {
  if (autoReplyTimers.has(chatId)) {
    return;
  }

  const timerId = setInterval(() => {
    const otherUserId = getOtherParticipantId(chatId);

    if (!otherUserId) {
      return;
    }

    const text = AUTO_REPLY_MESSAGES[Math.floor(Math.random() * AUTO_REPLY_MESSAGES.length)];
    const state = getMockState();
    const message: MockChatMessageJson = {
      id: `message_${Date.now()}`,
      chat_id: chatId,
      sender_id: otherUserId,
      text,
      created_at: new Date().toISOString(),
    };

    const chat = state.chats.find((item) => item.id === chatId);

    if (chat) {
      state.chatMessages.push(message);
      chat.last_message = message;
      chat.updated_at = message.created_at;
    }

    emit(chatId, { type: 'message', payload: message });
  }, 12000);

  autoReplyTimers.set(chatId, timerId);
}

function clearAutoReply(chatId: string) {
  const timerId = autoReplyTimers.get(chatId);

  if (timerId) {
    clearInterval(timerId);
    autoReplyTimers.delete(chatId);
  }
}

export function connectChatSocketMock(chatId: string, handler: ChatSocketHandler) {
  const chatHandlers = subscribers.get(chatId) ?? new Set<ChatSocketHandler>();
  chatHandlers.add(handler);
  subscribers.set(chatId, chatHandlers);

  setTimeout(() => {
    emit(chatId, { type: 'connected', chat_id: chatId });
  }, 150);

  scheduleAutoReply(chatId);

  return () => {
    chatHandlers.delete(handler);

    if (chatHandlers.size === 0) {
      subscribers.delete(chatId);
      clearAutoReply(chatId);
    }
  };
}

export async function sendChatSocketMockMessage(chatId: string, text: string) {
  const message = await fetchSendChatMessage(chatId, text.trim());
  emit(chatId, { type: 'message', payload: message });
  return message;
}

export function getChatPeerName(chatId: string) {
  const otherUserId = getOtherParticipantId(chatId);
  const user = otherUserId ? findMockUser(otherUserId) : null;

  return user?.display_name ?? 'Чат';
}
