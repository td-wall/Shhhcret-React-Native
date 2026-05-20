import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Gender } from '../../services/auth';
import { AuthTopBar, IntroStep, ProfileStep, TermsStep } from './AuthFlowParts';
import {
  Agreements,
  AuthStep,
  REQUIRED_TERMS,
  TermId,
  TERMS,
} from './authFlowTypes';
import { authStyles as styles } from './authFlowStyles';

const INITIAL_AGREEMENTS: Agreements = {
  service: false,
  privacy: false,
  location: false,
  marketing: false,
};

export function AuthFlow() {
  const router = useRouter();
  const { isSigningIn, signInWithKakao } = useAuth();
  const [step, setStep] = useState<AuthStep>('intro');
  const [agreements, setAgreements] = useState<Agreements>(INITIAL_AGREEMENTS);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [error, setError] = useState<string | null>(null);

  const requiredAgreed = REQUIRED_TERMS.every(id => agreements[id]);
  const allAgreed = TERMS.every(term => agreements[term.id]);
  const nicknameValid = nickname.trim().length > 0;

  const progress = useMemo(() => {
    if (step === 'terms') return 1;
    return 2;
  }, [step]);

  const goBack = () => {
    setStep(step === 'profile' ? 'terms' : 'intro');
  };

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreements({
      service: next,
      privacy: next,
      location: next,
      marketing: next,
    });
  };

  const toggleTerm = (id: TermId) => {
    setAgreements(current => ({ ...current, [id]: !current[id] }));
  };

  const submit = async () => {
    setError(null);
    if (!nicknameValid) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    try {
      await signInWithKakao({ nickname, gender });
      router.replace('/(tabs)/map');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        {step !== 'intro' && (
          <AuthTopBar
            progress={progress}
            totalSteps={2}
            canGoBack
            onBack={goBack}
          />
        )}

        {step === 'intro' && (
          <IntroStep onNext={() => setStep('terms')} />
        )}


        {step === 'terms' && (
          <TermsStep
            agreements={agreements}
            allAgreed={allAgreed}
            requiredAgreed={requiredAgreed}
            onToggleAll={toggleAll}
            onToggleTerm={toggleTerm}
            onOpenTerm={(id) => router.push({ pathname: '/terms/[id]', params: { id } })}
            onNext={() => setStep('profile')}
          />
        )}

        {step === 'profile' && (
          <ProfileStep
            nickname={nickname}
            gender={gender}
            error={error}
            isSubmitting={isSigningIn}
            canSubmit={nicknameValid}
            onNicknameChange={setNickname}
            onGenderChange={setGender}
            onSubmit={submit}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
