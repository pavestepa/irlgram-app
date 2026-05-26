import type { Post, PostId } from '../model';

export async function getPost(_id: PostId): Promise<Post> {
  throw new Error('getPost is not implemented');
}

export async function getPosts(): Promise<Post[]> {
  throw new Error('getPosts is not implemented');
}
