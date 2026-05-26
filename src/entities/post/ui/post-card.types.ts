import type { Post } from '../model';
import type { User } from '@/entities/user';

export type PostAuthor = Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;

export type PostCardProps = {
  post: Post;
  author: PostAuthor;
};
