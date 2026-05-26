import { fetchSignIn as fetchSignInMock } from '@/mock';
import { MockApiError } from '@/mock/utils';

import type { AuthSession, SignInCredentials } from '../model';
import { mapAuthSession } from './mappers';
import { clearStoredSession, saveStoredSession } from './session-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

async function requestSignIn(credentials: SignInCredentials): Promise<AuthSession> {
  if (!API_BASE_URL) {
    try {
      const json = await fetchSignInMock({
        phone_number: credentials.phoneNumber,
        sms_code: credentials.smsCode,
      });
      return mapAuthSession(json);
    } catch (error) {
      if (error instanceof MockApiError) {
        throw new Error(error.message);
      }

      throw error;
    }
  }

  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Failed to sign in');
  }

  const data = (await response.json()) as AuthSession;
  return data;
}

export async function signIn(credentials: SignInCredentials): Promise<AuthSession> {
  const session = await requestSignIn(credentials);
  await saveStoredSession(session);
  return session;
}

export async function signOut(): Promise<void> {
  await clearStoredSession();
}

export { refreshSession } from './refresh-session';
