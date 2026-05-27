import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

import type { CommentCardProps } from './comment-card.types';

function formatCommentDate(isoDate: string) {
  return new Date(isoDate).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(displayName: string) {
  return displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function CommentCard({
  comment,
  author,
  authors,
  depth = 0,
  onLike,
  onReply,
  onReplyToChild,
  onLikeChild,
}: CommentCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, depth > 0 && styles.nested]}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.backgroundSelected }]}>
            {author.avatarUrl ? (
              <Image source={{ uri: author.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <ThemedText type="smallBold" themeColor="textSecondary">
                {getInitials(author.displayName)}
              </ThemedText>
            )}
          </View>
          <View style={styles.headerText}>
            <ThemedText type="smallBold">{author.displayName}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              @{author.username} · {formatCommentDate(comment.createdAt)}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.content}>{comment.content}</ThemedText>

        <View style={styles.actions}>
          <Pressable onPress={onLike} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText
              type="small"
              themeColor={comment.isLikedByCurrentUser ? 'text' : 'textSecondary'}>
              {comment.likeCount} {comment.isLikedByCurrentUser ? '♥' : '♡'}
            </ThemedText>
          </Pressable>
          <Pressable onPress={onReply} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="small" themeColor="textSecondary">
              Ответить
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      {comment.replies.length > 0 ? (
        <View style={styles.replies}>
          {comment.replies.map((reply) => {
            const replyAuthor = authors[reply.authorId];

            if (!replyAuthor) {
              return null;
            }

            return (
              <CommentCard
                key={reply.id}
                comment={reply}
                author={replyAuthor}
                authors={authors}
                depth={depth + 1}
                onLike={() => onLikeChild(reply)}
                onReply={() => onReplyToChild(reply)}
                onReplyToChild={onReplyToChild}
                onLikeChild={onLikeChild}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  nested: {
    marginLeft: Spacing.three,
  },
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  content: {
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  replies: {
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
