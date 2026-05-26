import type { UserId } from '@/entities/user';

export type ChatId = string;
export type ChatMessageId = string;

export type Chat = {
  id: ChatId;
  participantIds: UserId[];
  lastMessage?: ChatMessage;
  updatedAt: string;
};

export type ChatMessage = {
  id: ChatMessageId;
  chatId: ChatId;
  senderId: UserId;
  text: string;
  createdAt: string;
};
