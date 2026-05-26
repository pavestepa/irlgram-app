import { fetchPost as fetchPostMock, fetchPosts as fetchPostsMock } from '@/mock';

import type { Post, PostId } from '../model';
import { mapPost } from './mappers';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function getPost(id: PostId): Promise<Post> {
  if (!API_BASE_URL) {
    const json = await fetchPostMock(id);
    return mapPost(json);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${id}`);

  if (!response.ok) {
    throw new Error('Failed to load post');
  }

  const data = (await response.json()) as Post;
  return data;
}

export async function getPosts(): Promise<Post[]> {
  if (!API_BASE_URL) {
    const json = await fetchPostsMock();
    return json.map(mapPost);
  }

  const response = await fetch(`${API_BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error('Failed to load posts');
  }

  const data = (await response.json()) as Post[];
  return data;
}
