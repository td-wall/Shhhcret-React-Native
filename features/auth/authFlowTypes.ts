import { Gender } from '../../services/auth';

export type AuthStep = 'intro' | 'terms' | 'profile';

export const REQUIRED_TERMS = ['service', 'privacy', 'location'] as const;

export const TERMS = [
  { id: 'service', label: '서비스 이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'location', label: '위치기반 서비스 이용 동의', required: true },
  { id: 'marketing', label: '이벤트 및 혜택 알림 동의', required: false },
] as const;

export type TermId = typeof TERMS[number]['id'];

export type Agreements = Record<TermId, boolean>;

export interface ProfileFormState {
  nickname: string;
  gender?: Gender;
}
