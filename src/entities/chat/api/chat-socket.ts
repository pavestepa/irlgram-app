import {
  connectChatSocketMock,
  sendChatSocketMockMessage,
  type ChatSocketEvent,
} from '@/mock/websocket/chat-socket-mock';
import type { MockChatMessageJson } from '@/mock/types';

import type { ChatMessage } from '../model';
import { mapChatMessage } from './mappers';

export type ChatSocketEventMapped =
  | { type: 'connected'; chatId: string }
  | { type: 'message'; message: ChatMessage }
  | { type: 'error'; message: string };

function mapSocketEvent(event: ChatSocketEvent): ChatSocketEventMapped {
  if (event.type === 'connected') {
    return { type: 'connected', chatId: event.chat_id };
  }

  if (event.type === 'message') {
    return { type: 'message', message: mapChatMessage(event.payload) };
  }

  return { type: 'error', message: event.message };
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export function connectChatSocket(
  chatId: string,
  onEvent: (event: ChatSocketEventMapped) => void,
) {
  if (API_BASE_URL) {
    throw new Error('Real chat websocket is not implemented');
  }

  return connectChatSocketMock(chatId, (event) => {
    onEvent(mapSocketEvent(event));
  });
}

export async function sendChatSocketMessage(chatId: string, text: string): Promise<ChatMessage> {
  if (!API_BASE_URL) {
    const json: MockChatMessageJson = await sendChatSocketMockMessage(chatId, text);
    return mapChatMessage(json);
  }

  throw new Error('Real chat websocket is not implemented');
}

export { getChatPeerName } from '@/mock/websocket/chat-socket-mock';
