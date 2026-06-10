import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/tokens';
import { Gender } from '../../services/auth';
import { authStyles as styles } from './authFlowStyles';
import { Agreements, TermId, TERMS } from './authFlowTypes';

interface AuthTopBarProps {
  progress: number;
  totalSteps: number;
  canGoBack: boolean;
  onBack: () => void;
}

export function AuthTopBar({ progress, totalSteps, canGoBack, onBack }: AuthTopBarProps) {
  return (
    <View style={styles.topBar}>
      {canGoBack ? (
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backSlot} />
      )}

      <View style={styles.progressDots}>
        {Array.from({ length: totalSteps }, (_, i) => i).map(i => {
          const active = i + 1 === progress;
          const past = i + 1 < progress;
          return (
            <View
              key={i}
              style={[
                styles.progressDot,
                active && styles.progressDotActive,
                past && styles.progressDotPast,
              ]}
            />
          );
        })}
      </View>

      <View style={styles.backSlot} />
    </View>
  );
}

function ShhhMark({ size = 26 }: { size?: number }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: Colors.ink1000,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{
        color: '#ffffff',
        fontSize: size * 0.56,
        fontWeight: '900',
        includeFontPadding: false,
      }}>ʃ</Text>
    </View>
  );
}

export function IntroStep({ onNext, onBrowse }: { onNext: () => void; onBrowse?: () => void }) {
  const [loading, setLoading] = React.useState(false);

  const handleKakao = () => {
    setLoading(true);
    // 실제로는 약관 동의 단계로 이동
    setTimeout(() => { setLoading(false); onNext(); }, 300);
  };

  return (
    <View style={styles.introScreen}>
      {/* 브랜드 바 */}
      <View style={styles.introBrandBar}>
        <ShhhMark size={26} />
        <Text style={styles.introBrandName}>Shhh-cret</Text>
        <Text style={styles.introBrandMission}>MISSION · ACTIVE</Text>
      </View>

      {/* 히어로 */}
      <View style={styles.introHero}>
        <Text style={styles.introTitle}>
          {'쉬크릿에\n합류할\n준비됐어요?'}
        </Text>
        <Text style={styles.introDesc}>
          {'요원들이 발굴한 비밀 화장실,\n한가한 시간대, 현장 팁까지 —\n지금 바로 공유받으세요.'}
        </Text>
      </View>

      {/* 하단 액션 */}
      <View style={styles.introActions}>
        <KakaoButton
          label="카카오톡으로 로그인"
          isLoading={loading}
          onPress={handleKakao}
        />

        {onBrowse && (
          <TouchableOpacity onPress={onBrowse} activeOpacity={0.7} style={styles.browseButton}>
            <Text style={styles.browseText}>일단 구경만 할게요</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.introTermsNote}>
          {'시작하면 '}
          <Text style={styles.introTermsLink}>서비스 약관</Text>
          {'과 '}
          <Text style={styles.introTermsLink}>개인정보처리방침</Text>
          {'에 동의해요.'}
        </Text>
      </View>
    </View>
  );
}

interface TermsStepProps {
  agreements: Agreements;
  allAgreed: boolean;
  requiredAgreed: boolean;
  onToggleAll: () => void;
  onToggleTerm: (id: TermId) => void;
  onOpenTerm: (id: TermId) => void;
  onNext: () => void;
}

export function TermsStep({
  agreements,
  allAgreed,
  requiredAgreed,
  onToggleAll,
  onToggleTerm,
  onOpenTerm,
  onNext,
}: TermsStepProps) {
  const toggleTerm = (event: GestureResponderEvent, id: TermId) => {
    event.stopPropagation();
    onToggleTerm(id);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.sectionTitle}>{'서비스 사용을 위해\n약관에 동의해주세요'}</Text>
      <Text style={styles.sectionSub}>
        필수 항목만 동의해도 쉬크릿을 바로 시작할 수 있어요.
      </Text>

      <Pressable onPress={onToggleAll} style={[
        styles.allAgreeRow,
        allAgreed && styles.allAgreeRowActive,
      ]}>
        <CheckIcon checked={allAgreed} large />
        <Text style={styles.allAgreeText}>전체 동의</Text>
      </Pressable>

      <View style={styles.termList}>
        {TERMS.map(term => (
          <Pressable
            key={term.id}
            onPress={() => onOpenTerm(term.id)}
            style={styles.termRow}
          >
            <Pressable
              onPress={(event) => toggleTerm(event, term.id)}
              hitSlop={8}
              style={styles.termCheckButton}
            >
              <CheckIcon checked={agreements[term.id]} />
            </Pressable>
            <Text style={styles.termText}>
              {term.required ? '[필수] ' : '[선택] '}
              {term.label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.text3} />
          </Pressable>
        ))}
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          onPress={onNext}
          disabled={!requiredAgreed}
          activeOpacity={0.85}
          style={[styles.primaryButton, !requiredAgreed && styles.disabledButton]}
        >
          <Text style={styles.primaryButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface ProfileStepProps {
  nickname: string;
  gender?: Gender;
  error: string | null;
  isSubmitting: boolean;
  canSubmit: boolean;
  onNicknameChange: (value: string) => void;
  onGenderChange: (value?: Gender) => void;
  onSubmit: () => void;
}

export function ProfileStep({
  nickname,
  gender,
  error,
  isSubmitting,
  canSubmit,
  onNicknameChange,
  onGenderChange,
  onSubmit,
}: ProfileStepProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.sectionTitle}>{'요원 정보를\n등록해주세요'}</Text>
      <Text style={styles.sectionSub}>
        닉네임은 리뷰와 스크랩 화면에서 표시돼요.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.monoLabel}>CODENAME</Text>
        <TextInput
          value={nickname}
          onChangeText={(v) => onNicknameChange(v.slice(0, 16))}
          placeholder="예: 화장실 탐험가"
          placeholderTextColor={Colors.text3}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={16}
          style={[styles.input, nickname.length > 0 && styles.inputActive]}
        />
        <View style={styles.inputHelperRow}>
          <Text style={styles.helper}>16자 이하로 입력해주세요</Text>
          <Text style={[styles.helper, nickname.length > 12 && styles.helperWarn]}>
            {nickname.length}/16
          </Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.monoLabel}>GENDER</Text>
        <View style={styles.segmented}>
          <GenderButton
            label="여성"
            selected={gender === 'FEMALE'}
            onPress={() => onGenderChange('FEMALE')}
          />
          <GenderButton
            label="남성"
            selected={gender === 'MALE'}
            onPress={() => onGenderChange('MALE')}
          />
        </View>
      </View>

      {!!error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color="#b3261e" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.bottomArea}>
        <TouchableOpacity
          onPress={canSubmit ? onSubmit : undefined}
          disabled={!canSubmit || isSubmitting}
          activeOpacity={0.85}
          style={[styles.primaryButton, (!canSubmit || isSubmitting) && styles.disabledButton]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.ink25} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {canSubmit ? '쉬크릿 시작하기 🤫' : '코드네임을 입력해주세요'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function KakaoButton({
  label,
  onPress,
  disabled,
  isLoading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.85}
      style={[styles.kakaoButton, (disabled || isLoading) && styles.kakaoButtonLoading]}
    >
      {isLoading ? (
        <Text style={styles.kakaoEncryptingText}>ENCRYPTING...</Text>
      ) : (
        <>
          <KakaoLogo />
          <Text style={styles.kakaoButtonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function KakaoLogo() {
  return (
    <Text style={{ fontSize: 18, lineHeight: 20 }}>💬</Text>
  );
}

function CheckIcon({ checked, large }: { checked: boolean; large?: boolean }) {
  const size = large ? 24 : 20;
  return (
    <View
      style={[
        styles.checkIcon,
        { width: size, height: size, borderRadius: size / 2 },
        !checked && styles.checkIconUnchecked,
        checked && styles.checkIconChecked,
      ]}
    >
      {checked && (
        <Ionicons name="checkmark" size={size - 6} strokeWidth={3} color={Colors.ink25} />
      )}
    </View>
  );
}

function GenderButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.genderButton, selected && styles.genderButtonSelected]}
    >
      <Text style={[styles.genderText, selected && styles.genderTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}
