import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

import type { ChatId } from '../model';
import { useChatRoom } from '../hooks/use-chat-room';

type ChatRoomOverlayProps = {
  chatId: ChatId;
  peerName: string;
  onClose: () => void;
};

function formatMessageTime(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatRoomOverlay({ chatId, peerName, onClose }: ChatRoomOverlayProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const { messages, currentUserId, isLoading, isSending, isConnected, error, sendMessage } =
    useChatRoom(chatId);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="linkPrimary">Назад</ThemedText>
        </Pressable>
        <View style={styles.headerCenter}>
          <ThemedText type="smallBold">{peerName}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {isConnected ? 'online (mock ws)' : 'подключение...'}
          </ThemedText>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUserId;

          return (
            <View style={[styles.messageRow, isMine ? styles.messageRowMine : styles.messageRowPeer]}>
              <ThemedView
                type={isMine ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.messageBubble}>
                <ThemedText>{item.text}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.messageTime}>
                  {formatMessageTime(item.createdAt)}
                </ThemedText>
              </ThemedView>
            </View>
          );
        }}
      />

      {error ? (
        <ThemedText type="small" themeColor="error" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Сообщение"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <Pressable
          disabled={isSending || !draft.trim()}
          onPress={() => {
            void sendMessage(draft).then(() => setDraft(''));
          }}
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: theme.text, opacity: pressed || isSending || !draft.trim() ? 0.7 : 1 },
          ]}>
          <ThemedText themeColor="background" type="smallBold">
            {isSending ? '...' : '→'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  headerSpacer: {
    width: 56,
  },
  messages: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  messageRow: {
    width: '100%',
  },
  messageRowMine: {
    alignItems: 'flex-end',
  },
  messageRowPeer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  messageTime: {
    alignSelf: 'flex-end',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    paddingHorizontal: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
});
