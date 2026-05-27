import { useLocationStore } from '@/entities/map/store/location-store';
import { usePostCommentsStore } from '@/entities/comment/store/post-comments-store';
import { useChatRoomStore } from '@/entities/chat/store/chat-room-store';
import { useChatsStore } from '@/entities/chat/store/chats-store';
import { usePostsStore } from '@/entities/post/store/posts-store';
import { useCurrentUserStore } from '@/entities/user/store/current-user-store';

export function resetEntityStores() {
  useCurrentUserStore.getState().reset();
  usePostsStore.getState().reset();
  useChatsStore.getState().reset();
  useChatRoomStore.getState().reset();
  usePostCommentsStore.getState().reset();
  useLocationStore.getState().reset();
}
