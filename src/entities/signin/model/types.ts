export type SignInCredentials = {
  phoneNumber: string;
  smsCode: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';
