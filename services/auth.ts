import { login } from '@react-native-seoul/kakao-login';

export type Gender = 'MALE' | 'FEMALE';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  isJoined: boolean;
}

interface KakaoAuthApiResponse {
  accessToken: string;
  refreshToken: string;
  isJoined: boolean;
}

interface KakaoSignInParams {
  nickname: string;
  gender: Gender;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';

export function canUseKakaoNative() {
  return !!API_BASE_URL;
}

export async function signInWithKakao({
  nickname,
  gender,
}: KakaoSignInParams): Promise<AuthSession> {
  let kakaoToken;
  try {
    kakaoToken = await login();
  } catch (e: any) {
    console.error('[kakao login error]', JSON.stringify(e), e?.message, e?.code);
    throw e;
  }

  const requestBody = JSON.stringify({
    kakaoAccessToken: kakaoToken.accessToken,
    nickname,
    gender,
  });
  console.log('[auth] request url:', `${API_BASE_URL}/v1/auth/kakao`);
  console.log('[auth] request body:', requestBody);
  const response = await fetch(`${API_BASE_URL}/v1/auth/kakao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  let payload: KakaoAuthApiResponse | undefined;
  try {
    const text = await response.text();
    console.log('[auth] raw response:', text);
    payload = JSON.parse(text);
  } catch {
    payload = undefined;
  }

  if (!response.ok || !payload?.accessToken || !payload?.refreshToken) {
    throw new Error('로그인 요청에 실패했습니다.');
  }

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    isJoined: payload.isJoined,
  };
}
