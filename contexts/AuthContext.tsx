import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  AuthSession,
  canUseKakaoNative,
  Gender,
  refreshTokens,
  signInWithKakao,
} from '../services/auth';

const STORAGE_KEY_ACCESS = 'auth_access_token';
const STORAGE_KEY_REFRESH = 'auth_refresh_token';

interface SignInInput {
  nickname: string;
  gender: Gender;
}

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  isLoading: boolean;
  signInWithKakao: (input: SignInInput) => Promise<void>;
  signOut: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ref로 최신 session 접근 (fetchWithAuth 클로저에서 stale 방지)
  const sessionRef = useRef<AuthSession | null>(null);
  sessionRef.current = session;

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(STORAGE_KEY_ACCESS);
        const refreshToken = await SecureStore.getItemAsync(STORAGE_KEY_REFRESH);
        if (accessToken && refreshToken) {
          setSession({ accessToken, refreshToken, isJoined: true });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveSession = useCallback(async (nextSession: AuthSession) => {
    await SecureStore.setItemAsync(STORAGE_KEY_ACCESS, nextSession.accessToken);
    await SecureStore.setItemAsync(STORAGE_KEY_REFRESH, nextSession.refreshToken);
    setSession(nextSession);
  }, []);

  const signInWithKakaoHandler = useCallback(async ({ nickname, gender }: SignInInput) => {
    setIsSigningIn(true);
    try {
      if (!canUseKakaoNative()) {
        await saveSession(createPreviewSession({ nickname, gender }));
        return;
      }

      const nextSession = await signInWithKakao({ nickname: nickname.trim(), gender });
      await saveSession(nextSession);
    } finally {
      setIsSigningIn(false);
    }
  }, [saveSession]);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEY_ACCESS);
    await SecureStore.deleteItemAsync(STORAGE_KEY_REFRESH);
    setSession(null);
  }, []);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const current = sessionRef.current;

    const doFetch = (accessToken: string) =>
      fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

    if (!current) {
      return doFetch('');
    }

    const response = await doFetch(current.accessToken);

    if (response.status !== 401) {
      return response;
    }

    // 401 → 토큰 갱신 시도
    try {
      const refreshed = await refreshTokens(current.refreshToken);
      const nextSession: AuthSession = { ...current, ...refreshed };
      await saveSession(nextSession);
      return doFetch(refreshed.accessToken);
    } catch {
      await signOut();
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
  }, [saveSession, signOut]);

  const isAuthenticated = !!session;

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAuthenticated,
    isSigningIn,
    isLoading,
    signInWithKakao: signInWithKakaoHandler,
    signOut,
    fetchWithAuth,
  }), [isAuthenticated, isSigningIn, isLoading, session, signInWithKakaoHandler, signOut, fetchWithAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function createPreviewSession(_input: SignInInput): AuthSession {
  return {
    accessToken: 'preview-access-token',
    refreshToken: 'preview-refresh-token',
    isJoined: false,
  };
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return value;
}
