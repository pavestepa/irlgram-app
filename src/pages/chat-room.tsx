import { router, useLocalSearchParams } from 'expo-router';

import { ChatRoomOverlay } from '@/entities/chat/ui';
import type { ChatId } from '@/entities/chat/model';

export default function ChatRoomScreen() {
  const { id, peerName } = useLocalSearchParams<{ id: string; peerName?: string }>();

  if (!id) {
    router.back();
    return null;
  }

  return (
    <ChatRoomOverlay
      chatId={id as ChatId}
      peerName={peerName ?? 'Чат'}
      onClose={() => router.back()}
    />
  );
}
