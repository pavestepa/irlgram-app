import { SESSION_REFRESH_LEAD_MS } from './constants';
import type { AuthSession } from './types';

export function isSessionValid(session: AuthSession | null | undefined): boolean {
  if (!session?.accessToken || !session.expiresAt) {
    return false;
  }

  return session.expiresAt > Date.now();
}

export function shouldRefreshSession(session: AuthSession): boolean {
  if (!session.refreshToken) {
    return false;
  }

  return session.expiresAt - Date.now() <= SESSION_REFRESH_LEAD_MS;
}
