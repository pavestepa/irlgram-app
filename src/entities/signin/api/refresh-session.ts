import { fetchRefreshSession as fetchRefreshSessionMock } from '@/mock';

import type { AuthSession } from '../model';
import { mapAuthSession } from './mappers';
import { saveStoredSession } from './session-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

async function requestSessionRefresh(refreshToken: string): Promise<AuthSession> {
  if (!API_BASE_URL) {
    const json = await fetchRefreshSessionMock({ refresh_token: refreshToken });
    return mapAuthSession(json);
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
