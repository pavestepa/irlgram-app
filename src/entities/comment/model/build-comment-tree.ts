import type { Comment, CommentWithReplies } from './types';

function sortComments(items: CommentWithReplies[]) {
  items.sort((left, right) => left.createdAt.localeCompare(right.createdAt));

  for (const item of items) {
    sortComments(item.replies);
  }
}

export function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const nodes = new Map<string, CommentWithReplies>();

  for (const comment of comments) {
    nodes.set(comment.id, { ...comment, replies: [] });
  }

  const roots: CommentWithReplies[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id)!;

    if (comment.parentCommentId) {
      nodes.get(comment.parentCommentId)?.replies.push(node);
      continue;
    }

    roots.push(node);
  }

  sortComments(roots);
  return roots;
}
