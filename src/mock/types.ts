export const MOCK_DELAY_MS = 150;

export const MOCK_SESSION_ACCESS_TTL_MS = 60 * 60 * 1000;

export type MockSignInRequestJson = {
  phone_number: string;
  sms_code: string;
};

export type MockRefreshSessionRequestJson = {
  refresh_token: string;
};

export type MockAuthSessionJson = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export type MockUserJson = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
};

export type MockUpdateUserRequestJson = {
  username?: string;
  display_name?: string;
  bio?: string;
};

export const MOCK_UPDATE_USER_DELAY_MS = 500;

export type MockPostJson = {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  like_count: number;
  comment_count: number;
};

export type MockFriendJson = {
  id: string;
  user: MockUserJson;
  since: string;
};

export type MockFriendRequestJson = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
};

export type MockSphereJson = {
  id: string;
  name: string;
  description?: string;
  member_count: number;
  cover_url?: string;
};

export type MockMapLocationJson = {
  latitude: number;
  longitude: number;
};

export type MockMapMarkerJson = {
  id: string;
  user_id: string;
  location: MockMapLocationJson;
  label?: string;
};

export type MockChatMessageJson = {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

export type MockChatJson = {
  id: string;
  participant_ids: string[];
  last_message?: MockChatMessageJson;
  updated_at: string;
};
