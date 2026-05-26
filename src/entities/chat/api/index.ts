import {
  fetchChatMessages as fetchChatMessagesMock,
  fetchChats as fetchChatsMock,
} from '@/mock';

import type { Chat, ChatId, ChatMessage } from '../model';
import { mapChat, mapChatMessage } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function getChats(): Promise<Chat[]> {
  if (!API_BASE_URL) {
    const json = await fetchChatsMock();
    return json.map(mapChat);
  }

  const response = await fetch(`${API_BASE_URL}/chats`);

  if (!response.ok) {
    throw new Error('Failed to load chats');
  }

  const data = (await response.json()) as Chat[];
  return data;
}

export async function getChatMessages(chatId: ChatId): Promise<ChatMessage[]> {
  if (!API_BASE_URL) {
    const json = await fetchChatMessagesMock(chatId);
    return json.map(mapChatMessage);
  }

  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);

  if (!response.ok) {
    throw new Error('Failed to load chat messages');
  }

  const data = (await response.json()) as ChatMessage[];
  return data;
}

export { connectChatSocket, getChatPeerName, sendChatSocketMessage } from './chat-socket';
export type { ChatSocketEventMapped } from './chat-socket';
