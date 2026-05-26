import { MOCK_SIGN_IN_DELAY_MS } from './constants';
import { getMockState, resetMockState } from './state';
import type {
  MockAuthSessionJson,
  MockRefreshSessionRequestJson,
  MockSignInRequestJson,
} from './types';
import { MOCK_SESSION_ACCESS_TTL_MS } from './types';
import { isValidMockPhoneNumber, isValidMockSmsCode } from './validate-auth';
import { mockDelay, mockDelayMs, mockReject, mockRejectMs } from './utils';

function createSessionJson(refreshToken: string): MockAuthSessionJson {
  const now = Date.now();

  return {
    access_token: `access_${now}`,
    refresh_token: refreshToken,
    expires_at: now + MOCK_SESSION_ACCESS_TTL_MS,
  };
}

export async function fetchSignIn(body: MockSignInRequestJson): Promise<MockAuthSessionJson> {
  if (!body.phone_number?.trim() || !body.sms_code?.trim()) {
    return mockRejectMs('Неверно введены данные', 401, MOCK_SIGN_IN_DELAY_MS);
  }

  if (!isValidMockPhoneNumber(body.phone_number) || !isValidMockSmsCode(body.sms_code)) {
    return mockRejectMs('Неверно введены данные', 401, MOCK_SIGN_IN_DELAY_MS);
  }

  resetMockState(body.phone_number);

  const refreshToken = `refresh_${body.phone_number.replace(/\D/g, '')}_${Date.now()}`;
  return mockDelayMs(createSessionJson(refreshToken), MOCK_SIGN_IN_DELAY_MS);
}

export async function fetchResendSmsCode(phoneNumber: string): Promise<{ ok: true }> {
  if (!phoneNumber.trim()) {
    return mockRejectMs('Неверно введены данные', 400, MOCK_SIGN_IN_DELAY_MS);
  }

  return mockDelayMs({ ok: true as const }, MOCK_SIGN_IN_DELAY_MS);
}

export async function fetchRefreshSession(
  body: MockRefreshSessionRequestJson,
): Promise<MockAuthSessionJson> {
  if (!body.refresh_token) {
    return mockReject('Refresh token is required', 401);
  }

  const state = getMockState();

  if (state.currentUserId === 'user_guest') {
    return mockReject('Session expired', 401);
  }

  return mockDelay(createSessionJson(body.refresh_token));
}
