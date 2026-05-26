import { getMockState } from './state';
import type { MockChatJson, MockChatMessageJson } from './types';
import { mockDelay, mockReject } from './utils';

export async function fetchChats(): Promise<MockChatJson[]> {
  const state = getMockState();
  return mockDelay(
    state.chats.map((chat) => ({
      ...chat,
      participant_ids: [...chat.participant_ids],
      last_message: chat.last_message ? { ...chat.last_message } : undefined,
    })),
  );
}

export async function fetchChatMessages(chatId: string): Promise<MockChatMessageJson[]> {
  const state = getMockState();
  const messages = state.chatMessages.filter((message) => message.chat_id === chatId);

  if (messages.length === 0) {
    return mockReject('Chat not found', 404);
  }

  return mockDelay(messages.map((message) => ({ ...message })));
}

export async function fetchSendChatMessage(
  chatId: string,
  text: string,
): Promise<MockChatMessageJson> {
  const state = getMockState();
  const chat = state.chats.find((item) => item.id === chatId);

  if (!chat) {
    return mockReject('Chat not found', 404);
  }

  const message: MockChatMessageJson = {
    id: `message_${Date.now()}`,
    chat_id: chatId,
    sender_id: state.currentUserId,
    text,
    created_at: new Date().toISOString(),
  };

  state.chatMessages.push(message);
  chat.last_message = message;
  chat.updated_at = message.created_at;

  return mockDelay({ ...message });
}
