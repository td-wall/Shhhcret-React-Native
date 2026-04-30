import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  AuthSession,
  Gender,
  requestKakaoAuthCode,
  signInWithKakaoAuthCode,
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

  const signInWithKakao = useCallback(async ({ nickname, gender }: SignInInput) => {
    setIsSigningIn(true);
    try {
      const authCode = await requestKakaoAuthCode();
      const nextSession = await signInWithKakaoAuthCode({
        authCode,
        nickname: nickname.trim(),
        gender,
      });
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
    signInWithKakao,
    signOut,
  }), [isAuthenticated, isSigningIn, session, signInWithKakao, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return value;
}
