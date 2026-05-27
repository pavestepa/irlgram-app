import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/shared/constants/theme';

import type { CommentWithReplies } from '../model';
import type { CommentAuthor } from '../hooks/use-post-comments';
import { CommentCard } from './comment-card';

type CommentThreadProps = {
  comments: CommentWithReplies[];
  authors: Record<string, CommentAuthor>;
  onLike: (comment: CommentWithReplies) => void;
  onReply: (comment: CommentWithReplies) => void;
};

export function CommentThread({ comments, authors, onLike, onReply }: CommentThreadProps) {
  return (
    <View style={styles.thread}>
      {comments.map((comment) => {
        const author = authors[comment.authorId];

        if (!author) {
          return null;
        }

        return (
          <CommentCard
            key={comment.id}
            comment={comment}
            author={author}
            authors={authors}
            onLike={() => onLike(comment)}
            onReply={() => onReply(comment)}
            onLikeChild={onLike}
            onReplyToChild={onReply}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: Spacing.three,
  },
});
