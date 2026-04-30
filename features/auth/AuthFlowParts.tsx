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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/tokens';
import { Gender } from '../../services/auth';
import { Agreements, TermId, TERMS } from './authFlowTypes';
import { authStyles as styles } from './authFlowStyles';

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
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map(item => (
          <View
            key={item}
            style={[
              styles.progressDot,
              item <= progress && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.backSlot} />
    </View>
  );
}

export function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.screen}>
      <View style={styles.brandMark}>
        <Ionicons name="male-female" size={34} color={Colors.ink1000} />
      </View>
      <Text style={styles.kicker}>SHHH-CRET</Text>
      <Text style={styles.title}>비밀스런 화장실 리뷰</Text>
      <Text style={styles.description}>
        급한 순간에 믿고 찾을 수 있도록, 진짜 다녀온 사람들의 정보를 모아둘게요.
      </Text>
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <View>
            <Text style={styles.previewTitle}>근처 쉬크릿</Text>
            <Text style={styles.previewSub}>깨끗함 4.7 · 향 4.3</Text>
          </View>
          <Ionicons name="lock-closed" size={18} color={Colors.ink25} />
        </View>
        <View style={styles.previewLines}>
          <View style={[styles.previewLine, { width: '86%' }]} />
          <View style={[styles.previewLine, { width: '58%' }]} />
        </View>
      </View>
      <KakaoButton label="카카오로 시작하기" onPress={onNext} />
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
      <Text style={styles.sectionTitle}>서비스 사용을 위해 약관에 동의해주세요</Text>
      <Text style={styles.sectionSub}>
        필수 항목만 동의해도 쉬크릿을 바로 시작할 수 있어요.
      </Text>

      <Pressable onPress={onToggleAll} style={styles.allAgreeRow}>
        <CheckIcon checked={allAgreed} />
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
              <CheckIcon checked={agreements[term.id]} subtle />
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
      <Text style={styles.sectionTitle}>다녀온 기록에 표시될 정보를 알려주세요</Text>
      <Text style={styles.sectionSub}>
        닉네임은 리뷰와 스크랩 화면에서 사용돼요.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          value={nickname}
          onChangeText={onNicknameChange}
          placeholder="예: 화장실 탐험가"
          placeholderTextColor={Colors.text3}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={16}
          style={styles.input}
        />
        <Text style={styles.helper}>16자 이하로 입력해주세요</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>성별</Text>
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
          <GenderButton
            label="선택 안 함"
            selected={!gender}
            onPress={() => onGenderChange(undefined)}
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
        <KakaoButton
          label="카카오 인증하고 시작하기"
          onPress={onSubmit}
          disabled={!canSubmit || isSubmitting}
          isLoading={isSubmitting}
        />
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
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.kakaoButton, disabled && styles.disabledButton]}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.ink1000} />
      ) : (
        <>
          <Text style={styles.kakaoIcon}>K</Text>
          <Text style={styles.kakaoButtonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function CheckIcon({ checked, subtle }: { checked: boolean; subtle?: boolean }) {
  return (
    <View
      style={[
        styles.checkIcon,
        subtle && styles.checkIconSubtle,
        checked && styles.checkIconChecked,
      ]}
    >
      {checked && <Ionicons name="checkmark" size={15} color={Colors.ink25} />}
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
