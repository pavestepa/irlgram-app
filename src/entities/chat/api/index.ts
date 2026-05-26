import type { Chat, ChatId, ChatMessage } from '../model';

export async function getChats(): Promise<Chat[]> {
  throw new Error('getChats is not implemented');
}

export async function getChatMessages(_chatId: ChatId): Promise<ChatMessage[]> {
  throw new Error('getChatMessages is not implemented');
}
