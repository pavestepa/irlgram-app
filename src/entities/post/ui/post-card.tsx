import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { Spacing } from '@/shared/constants/theme';
import { useTheme } from '@/shared/hooks/use-theme';

import type { PostCardProps } from './post-card.types';

function formatPostDate(isoDate: string) {
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

export function PostCard({ post, author }: PostCardProps) {
  const theme = useTheme();

  return (
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
            @{author.username} · {formatPostDate(post.createdAt)}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.content}>{post.content}</ThemedText>

      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} contentFit="cover" />
      ) : null}

      <View style={styles.stats}>
        <ThemedText type="small" themeColor="textSecondary">
          {post.likeCount} лайков
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {post.commentCount} комментариев
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    lineHeight: 22,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Spacing.three,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});
