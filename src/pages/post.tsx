import { router, useLocalSearchParams } from 'expo-router';

import { PostCommentsOverlay } from '@/entities/comment/ui';
import type { PostId } from '@/entities/post';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    router.back();
    return null;
  }

  return <PostCommentsOverlay postId={id as PostId} onClose={() => router.back()} />;
}
