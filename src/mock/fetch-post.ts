import { getMockState } from './state';
import type { MockPostJson } from './types';
import { mockDelay, mockReject } from './utils';

export async function fetchPosts(): Promise<MockPostJson[]> {
  const state = getMockState();
  return mockDelay(state.posts.map((post) => ({ ...post })));
}

export async function fetchPost(postId: string): Promise<MockPostJson> {
  const state = getMockState();
  const post = state.posts.find((item) => item.id === postId);

  if (!post) {
    return mockReject('Post not found', 404);
  }

  return mockDelay({ ...post });
}

export async function fetchLikePost(postId: string): Promise<MockPostJson> {
  const state = getMockState();
  const post = state.posts.find((item) => item.id === postId);

  if (!post) {
    return mockReject('Post not found', 404);
  }

  post.like_count += 1;
  return mockDelay({ ...post });
}
