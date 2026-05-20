import { login } from '@react-native-seoul/kakao-login';

export type Gender = 'MALE' | 'FEMALE';

export interface AuthUser {
  userId: string;
  email: string;
  nickname: string;
  gender: Gender;
  profileImageUrl?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface KakaoAuthApiResponse {
  status: string;
  data?: AuthUser & {
    accessToken?: string;
    refreshToken?: string;
  };
  message?: string;
}

interface KakaoSignInParams {
  nickname: string;
  gender?: Gender;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';

export function canUseKakaoNative() {
  return !!API_BASE_URL;
}

export async function signInWithKakao({
  nickname,
  gender,
}: KakaoSignInParams): Promise<AuthSession> {
  const kakaoToken = await login();

  const response = await fetch(`${API_BASE_URL}/v1/auth/kakao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: kakaoToken.accessToken,
      nickname,
      ...(gender ? { gender } : {}),
    }),
  });

  let payload: KakaoAuthApiResponse | undefined;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok || payload?.status !== 'success' || !payload.data) {
    throw new Error(payload?.message ?? '로그인 요청에 실패했습니다.');
  }

  const { accessToken, refreshToken, ...user } = payload.data;

  if (!accessToken || !refreshToken) {
    throw new Error('로그인 응답에 토큰이 없습니다.');
  }

  return {
    user,
    accessToken,
    refreshToken,
  };
}
