import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  AuthSession,
  canUseKakaoNative,
  Gender,
  signInWithKakao,
} from '../services/auth';

interface SignInInput {
  nickname: string;
  gender?: Gender;
}

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  signInWithKakao: (input: SignInInput) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signInWithKakaoHandler = useCallback(async ({ nickname, gender }: SignInInput) => {
    setIsSigningIn(true);
    try {
      if (!canUseKakaoNative()) {
        setSession(createPreviewSession({ nickname, gender }));
        return;
      }

      const nextSession = await signInWithKakao({ nickname: nickname.trim(), gender });
      setSession(nextSession);
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
  }, []);

  const isAuthenticated = !!session;

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAuthenticated,
    isSigningIn,
    signInWithKakao: signInWithKakaoHandler,
    signOut,
  }), [isAuthenticated, isSigningIn, session, signInWithKakaoHandler, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function createPreviewSession({ nickname, gender }: SignInInput): AuthSession {
  return {
    user: {
      userId: 'preview-user',
      email: 'preview@shhhcret.local',
      nickname: nickname.trim() || '쉬크릿 유저',
      gender: gender ?? 'FEMALE',
      profileImageUrl: null,
    },
    accessToken: 'preview-access-token',
    refreshToken: 'preview-refresh-token',
  };
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return value;
}
