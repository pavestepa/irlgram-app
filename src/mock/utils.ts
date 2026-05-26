import { MOCK_DELAY_MS } from './types';

export function mockDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS);
  });
}

export function mockDelayMs<T>(value: T, delayMs: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}

export function mockReject(message: string, status = 400): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new MockApiError(message, status));
    }, MOCK_DELAY_MS);
  });
}

export function mockRejectMs(message: string, status = 400, delayMs = MOCK_DELAY_MS): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new MockApiError(message, status));
    }, delayMs);
  });
}

export class MockApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'MockApiError';
    this.status = status;
  }
}
