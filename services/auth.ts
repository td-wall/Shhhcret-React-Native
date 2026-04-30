import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

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
  authCode: string;
  nickname: string;
  gender?: Gender;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? '';
const KAKAO_REDIRECT_URI =
  process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI ?? Linking.createURL('auth/kakao');

function assertConfigured(value: string, name: string) {
  if (!value) {
    throw new Error(`${name} 환경변수가 필요합니다.`);
  }
}

function toStringParam(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

export async function requestKakaoAuthCode() {
  assertConfigured(KAKAO_REST_API_KEY, 'EXPO_PUBLIC_KAKAO_REST_API_KEY');

  const query = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: 'code',
  });

  const result = await WebBrowser.openAuthSessionAsync(
    `https://kauth.kakao.com/oauth/authorize?${query.toString()}`,
    KAKAO_REDIRECT_URI,
  );

  if (result.type !== 'success') {
    throw new Error('카카오 로그인이 취소되었습니다.');
  }

  const parsed = Linking.parse(result.url);
  const error = toStringParam(parsed.queryParams?.error);
  const code = toStringParam(parsed.queryParams?.code);

  if (typeof error === 'string' && error.length > 0) {
    const description = toStringParam(parsed.queryParams?.error_description);
    throw new Error(typeof description === 'string' ? description : error);
  }

  if (typeof code !== 'string' || code.length === 0) {
    throw new Error('카카오 인증 코드를 찾지 못했습니다.');
  }

  return code;
}

export async function signInWithKakaoAuthCode({
  authCode,
  nickname,
  gender,
}: KakaoSignInParams): Promise<AuthSession> {
  assertConfigured(API_BASE_URL, 'EXPO_PUBLIC_API_BASE_URL');

  const response = await fetch(`${API_BASE_URL}/v1/auth/kakao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authCode,
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
