export const MOCK_VALID_PHONE = '+79000000000';
export const MOCK_VALID_PHONE_DIGITS = '79000000000';
export const MOCK_VALID_SMS_CODE = '000000';

export function normalizePhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`;
  }

  return digits;
}

export function isValidMockPhoneNumber(phoneNumber: string) {
  return normalizePhoneNumber(phoneNumber) === MOCK_VALID_PHONE_DIGITS;
}

export function isValidMockSmsCode(smsCode: string) {
  return smsCode.trim() === MOCK_VALID_SMS_CODE;
}
