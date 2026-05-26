import type {
  MockChatJson,
  MockChatMessageJson,
  MockFriendJson,
  MockFriendRequestJson,
  MockMapMarkerJson,
  MockPostJson,
  MockSphereJson,
  MockUserJson,
} from './types';

export type MockState = {
  currentUserId: string;
  users: MockUserJson[];
  posts: MockPostJson[];
  friends: MockFriendJson[];
  friendRequests: MockFriendRequestJson[];
  spheres: MockSphereJson[];
  mapMarkers: MockMapMarkerJson[];
  chats: MockChatJson[];
  chatMessages: MockChatMessageJson[];
};

function createUsers(currentUserId: string): MockUserJson[] {
  return [
    {
      id: currentUserId,
      username: 'me',
      display_name: 'Я',
      avatar_url: undefined,
      bio: 'irlgram user',
    },
    {
      id: 'user_anna',
      username: 'anna',
      display_name: 'Анна',
      bio: 'Москва',
    },
    {
      id: 'user_ivan',
      username: 'ivan',
      display_name: 'Иван',
      bio: 'Санкт-Петербург',
    },
    {
      id: 'user_maria',
      username: 'maria',
      display_name: 'Мария',
      bio: 'Казань',
    },
  ];
}

function createInitialState(currentUserId: string): MockState {
  const users = createUsers(currentUserId);

  const posts: MockPostJson[] = [
    {
      id: 'post_1',
      author_id: 'user_anna',
      content: 'Сегодня отличная погода для прогулки!',
      created_at: '2026-05-26T10:00:00.000Z',
      like_count: 12,
      comment_count: 3,
    },
    {
      id: 'post_2',
      author_id: currentUserId,
      content: 'Тестирую irlgram mock API',
      created_at: '2026-05-26T11:30:00.000Z',
      like_count: 4,
      comment_count: 1,
    },
    {
      id: 'post_3',
      author_id: 'user_ivan',
      content: 'Новый пост из мок-сервера',
      created_at: '2026-05-26T12:15:00.000Z',
      like_count: 7,
      comment_count: 0,
    },
  ];

  const friends: MockFriendJson[] = [
    {
      id: 'friend_1',
      user: users.find((user) => user.id === 'user_anna')!,
      since: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'friend_2',
      user: users.find((user) => user.id === 'user_ivan')!,
      since: '2026-02-14T18:00:00.000Z',
    },
  ];

  const friendRequests: MockFriendRequestJson[] = [
    {
      id: 'request_1',
      from_user_id: 'user_maria',
      to_user_id: currentUserId,
      created_at: '2026-05-25T16:00:00.000Z',
    },
  ];

  const spheres: MockSphereJson[] = [
    {
      id: 'sphere_1',
      name: 'Москва',
      description: 'Локальное сообщество',
      member_count: 128,
    },
    {
      id: 'sphere_2',
      name: 'Друзья рядом',
      description: 'Приватная сфера',
      member_count: 8,
    },
  ];

  const mapMarkers: MockMapMarkerJson[] = [
    {
      id: 'marker_1',
      user_id: 'user_anna',
      location: { latitude: 55.7558, longitude: 37.6173 },
      label: 'Анна',
    },
    {
      id: 'marker_2',
      user_id: 'user_ivan',
      location: { latitude: 59.9343, longitude: 30.3351 },
      label: 'Иван',
    },
  ];

  const chatMessages: MockChatMessageJson[] = [
    {
      id: 'message_1',
      chat_id: 'chat_1',
      sender_id: 'user_anna',
      text: 'Привет! Как дела?',
      created_at: '2026-05-26T09:00:00.000Z',
    },
    {
      id: 'message_2',
      chat_id: 'chat_1',
      sender_id: currentUserId,
      text: 'Отлично, тестирую приложение',
      created_at: '2026-05-26T09:05:00.000Z',
    },
    {
      id: 'message_3',
      chat_id: 'chat_2',
      sender_id: 'user_ivan',
      text: 'Увидимся завтра?',
      created_at: '2026-05-25T20:00:00.000Z',
    },
  ];

  const chats: MockChatJson[] = [
    {
      id: 'chat_1',
      participant_ids: [currentUserId, 'user_anna'],
      last_message: chatMessages[1],
      updated_at: '2026-05-26T09:05:00.000Z',
    },
    {
      id: 'chat_2',
      participant_ids: [currentUserId, 'user_ivan'],
      last_message: chatMessages[2],
      updated_at: '2026-05-25T20:00:00.000Z',
    },
  ];

  return {
    currentUserId,
    users,
    posts,
    friends,
    friendRequests,
    spheres,
    mapMarkers,
    chats,
    chatMessages,
  };
}

let state = createInitialState('user_guest');

export function resetMockState(phoneNumber: string) {
  const normalizedPhone = phoneNumber.replace(/\D/g, '') || 'guest';
  state = createInitialState(`user_${normalizedPhone}`);
}

export function getMockState() {
  return state;
}

export function findMockUser(userId: string) {
  return state.users.find((user) => user.id === userId);
}
