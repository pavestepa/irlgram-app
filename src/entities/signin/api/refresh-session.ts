import { SESSION_ACCESS_TTL_MS } from '../model/constants';
import type { AuthSession } from '../model';
import { saveStoredSession } from './session-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

function createSession(refreshToken: string): AuthSession {
  const now = Date.now();

  return {
    accessToken: `access_${now}`,
    refreshToken,
    expiresAt: now + SESSION_ACCESS_TTL_MS,
  };
}

async function requestSessionRefresh(refreshToken: string): Promise<AuthSession> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return createSession(refreshToken);
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh session');
  }

  const data = (await response.json()) as AuthSession;
  return data;
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const session = await requestSessionRefresh(refreshToken);
  await saveStoredSession(session);
  return session;
}
