import type { MockChatJson, MockChatMessageJson } from '@/mock/types';

import type { Chat, ChatMessage } from '../model';

export function mapChatMessage(json: MockChatMessageJson): ChatMessage {
  return {
    id: json.id,
    chatId: json.chat_id,
    senderId: json.sender_id,
    text: json.text,
    createdAt: json.created_at,
  };
}

export function mapChat(json: MockChatJson): Chat {
  return {
    id: json.id,
    participantIds: json.participant_ids,
    lastMessage: json.last_message ? mapChatMessage(json.last_message) : undefined,
    updatedAt: json.updated_at,
  };
}
