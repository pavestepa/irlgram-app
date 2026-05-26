import { fetchResendSmsCode as fetchResendSmsCodeMock } from '@/mock';
import { MockApiError } from '@/mock/utils';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export async function resendSmsCode(phoneNumber: string): Promise<void> {
  if (!API_BASE_URL) {
    try {
      await fetchResendSmsCodeMock(phoneNumber);
      return;
    } catch (error) {
      if (error instanceof MockApiError) {
        throw new Error(error.message);
      }

      throw error;
    }
  }

  const response = await fetch(`${API_BASE_URL}/auth/resend-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber }),
  });

  if (!response.ok) {
    throw new Error('Не удалось отправить код повторно');
  }
}
