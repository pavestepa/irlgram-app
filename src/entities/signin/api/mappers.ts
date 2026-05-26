import type { MockAuthSessionJson } from '@/mock/types';

import type { AuthSession } from '../model';

export function mapAuthSession(json: MockAuthSessionJson): AuthSession {
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: json.expires_at,
  };
}
