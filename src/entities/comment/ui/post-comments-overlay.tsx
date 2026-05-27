import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getPost } from '@/entities/post/api';
import { PostCard } from '@/entities/post/ui';
import type { Post, PostId } from '@/entities/post';
import { getUser } from '@/entities/user/api';
import type { PostCardProps } from '@/entities/post/ui/post-card.types';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

import { usePostComments } from '../hooks/use-post-comments';
import { CommentThread } from './comment-thread';

type PostCommentsOverlayProps = {
  postId: PostId;
  onClose: () => void;
};

export function PostCommentsOverlay({ postId, onClose }: PostCommentsOverlayProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const [post, setPost] = useState<Post | null>(null);
  const [postAuthor, setPostAuthor] = useState<PostCardProps['author'] | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const {
    comments,
    authors,
    replyTo,
    isLoading,
    isSubmitting,
    error,
    submitComment,
    toggleLike,
    startReply,
    cancelReply,
  } = usePostComments(postId);

  useEffect(() => {
    void (async () => {
      try {
        const loadedPost = await getPost(postId);
        const author = await getUser(loadedPost.authorId);

        setPost(loadedPost);
        setPostAuthor({
          id: author.id,
          username: author.username,
          displayName: author.displayName,
          avatarUrl: author.avatarUrl,
        });
      } catch {
        setPost(null);
        setPostAuthor(null);
      } finally {
        setIsPostLoading(false);
      }
    })();
  }, [postId]);

  if (isPostLoading || isLoading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  if (!post || !postAuthor) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="linkPrimary">Назад</ThemedText>
          </Pressable>
        </View>
        <ThemedText themeColor="textSecondary" style={styles.emptyState}>
          Пост не найден
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="linkPrimary">Назад</ThemedText>
        </Pressable>
        <ThemedText type="smallBold">Комментарии</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <PostCard post={post} author={postAuthor} />

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          {post.commentCount} комментариев
        </ThemedText>

        {comments.length > 0 ? (
          <CommentThread
            comments={comments}
            authors={authors}
            onLike={(comment) => void toggleLike(comment)}
            onReply={startReply}
          />
        ) : (
          <ThemedText themeColor="textSecondary">Пока нет комментариев</ThemedText>
        )}
      </ScrollView>

      {error ? (
        <ThemedText type="small" themeColor="error" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      {replyTo ? (
        <View style={styles.replyBanner}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.replyBannerText}>
            Ответ @{authors[replyTo.authorId]?.username ?? 'user'}
          </ThemedText>
          <Pressable onPress={cancelReply} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="small" themeColor="textSecondary">
              ✕
            </ThemedText>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={replyTo ? 'Ваш ответ' : 'Комментарий'}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <Pressable
          disabled={isSubmitting || !draft.trim()}
          onPress={() => {
            void submitComment(draft).then(() => setDraft(''));
          }}
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: theme.text, opacity: pressed || isSubmitting || !draft.trim() ? 0.7 : 1 },
          ]}>
          <ThemedText themeColor="background" type="smallBold">
            {isSubmitting ? '...' : '→'}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  headerSpacer: {
    width: 56,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitle: {
    marginTop: Spacing.one,
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
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  replyBannerText: {
    flex: 1,
  },
  error: {
    paddingHorizontal: Spacing.four,
  },
  emptyState: {
    paddingHorizontal: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
});
