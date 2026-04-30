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

export const TERM_DETAILS: Record<TermId, { title: string; summary: string; sections: string[] }> = {
  service: {
    title: '서비스 이용약관',
    summary: '쉬크릿 서비스를 이용하기 위한 기본 약속을 안내합니다.',
    sections: [
      '이 영역에는 서비스 이용 가능 범위, 회원의 책임, 서비스 제공 조건이 들어갈 예정입니다.',
      '정식 약관 문구가 확정되기 전까지는 화면 이동과 레이아웃 확인을 위한 임시 내용입니다.',
      '추후 계정 이용 제한, 서비스 변경, 면책 조항 등의 항목을 상세히 채울 수 있습니다.',
    ],
  },
  privacy: {
    title: '개인정보 수집 및 이용 동의',
    summary: '회원 식별과 서비스 제공을 위해 필요한 개인정보 처리 내용을 안내합니다.',
    sections: [
      '이 영역에는 수집 항목, 이용 목적, 보관 기간, 파기 절차가 들어갈 예정입니다.',
      '카카오 로그인으로 전달받는 이메일, 닉네임 등 계정 정보의 처리 기준을 작성할 수 있습니다.',
      '민감정보 또는 선택 정보가 추가될 경우 이 페이지에서 별도로 구분해 안내합니다.',
    ],
  },
  location: {
    title: '위치기반 서비스 이용 동의',
    summary: '주변 화장실 탐색과 리뷰 작성을 위한 위치정보 이용 기준을 안내합니다.',
    sections: [
      '이 영역에는 위치정보 수집 시점, 사용 목적, 보관 여부에 대한 내용이 들어갈 예정입니다.',
      '지도 기반 조회, 근처 장소 확인, 리뷰 위치 등록에 필요한 위치정보 처리 흐름을 적을 수 있습니다.',
      '위치정보 이용을 중단하거나 권한을 철회하는 방법도 이곳에 안내하면 됩니다.',
    ],
  },
  marketing: {
    title: '이벤트 및 혜택 알림 동의',
    summary: '선택 동의 항목으로, 쉬크릿의 소식과 혜택 안내 기준을 다룹니다.',
    sections: [
      '이 영역에는 이벤트, 업데이트, 혜택 알림을 어떤 채널로 보낼지 작성할 예정입니다.',
      '마케팅 수신 동의는 선택 사항이며, 동의하지 않아도 핵심 서비스 이용에는 제한이 없습니다.',
      '수신 철회 방법과 철회 이후 처리 시점도 추후 이 페이지에 채울 수 있습니다.',
    ],
  },
};
