// Shhh-cret Sample Data

export interface Restroom {
  id: string;
  name: string;
  sub: string;
  address: string;
  distance: number;
  rating: number;
  reviews: number;
  tags: string[];
  facilities: {
    sep: boolean;
    bidet: boolean;
    paper: boolean;
    soap: boolean;
    dryer: boolean;
    baby: boolean;
  };
  cleanliness: string;
  accessHours: string;
  secret: boolean;
  note: string;
  x: number;
  y: number;
}

export interface Review {
  id: number;
  user: string;
  initial: string;
  rating: number;
  time: string;
  text: string;
  tags: string[];
  helpful: number;
}

export const RESTROOMS: Restroom[] = [
  {
    id: 'gn-001',
    name: '강남역 2번 출구',
    sub: '지하상가 끝쪽',
    address: '서울 강남구 강남대로 396',
    distance: 80,
    rating: 4.8,
    reviews: 124,
    tags: ['남녀분리', '비데', '휴지'],
    facilities: { sep: true, bidet: true, paper: true, soap: true, dryer: true, baby: false },
    cleanliness: '매우 청결',
    accessHours: '24시',
    secret: true,
    note: '음악 흘러나옴, 향기 좋음',
    x: 38, y: 42,
  },
  {
    id: 'gn-002',
    name: '스타필드 코엑스 B1',
    sub: '별마당 도서관 옆',
    address: '서울 강남구 영동대로 513',
    distance: 320,
    rating: 4.9,
    reviews: 287,
    tags: ['남녀분리', '비데', '기저귀교환대', '넓음'],
    facilities: { sep: true, bidet: true, paper: true, soap: true, dryer: true, baby: true },
    cleanliness: '쾌적함',
    accessHours: '10:00 — 22:00',
    secret: false,
    note: '사람 많지만 넓어서 항상 한 칸은 비어있음',
    x: 62, y: 30,
  },
  {
    id: 'gn-003',
    name: '현대백화점 판교점 5F',
    sub: '리빙관 안쪽',
    address: '경기 성남시 분당구 판교역로 146',
    distance: 1820,
    rating: 5.0,
    reviews: 92,
    tags: ['프리미엄', '비데', '파우더룸'],
    facilities: { sep: true, bidet: true, paper: true, soap: true, dryer: true, baby: true },
    cleanliness: '최고의 위생',
    accessHours: '10:30 — 20:00',
    secret: true,
    note: '직원도 거의 모르는 5층 안쪽. 거의 전세 수준.',
    x: 25, y: 70,
  },
  {
    id: 'gn-004',
    name: '교보문고 광화문 지하',
    sub: '에스컬레이터 우측',
    address: '서울 종로구 종로 1',
    distance: 4200,
    rating: 4.4,
    reviews: 56,
    tags: ['남녀분리', '휴지'],
    facilities: { sep: true, bidet: false, paper: true, soap: true, dryer: false, baby: false },
    cleanliness: '괜찮음',
    accessHours: '09:30 — 22:00',
    secret: false,
    note: '조용한 편, 책 보다가 잠깐',
    x: 75, y: 58,
  },
  {
    id: 'gn-005',
    name: '성수 카페 거리 공용',
    sub: '골목 깊은 안쪽',
    address: '서울 성동구 성수이로 22길',
    distance: 5100,
    rating: 4.2,
    reviews: 38,
    tags: ['청결', '조용'],
    facilities: { sep: false, bidet: false, paper: true, soap: true, dryer: false, baby: false },
    cleanliness: '청결',
    accessHours: '11:00 — 21:00',
    secret: true,
    note: '단골만 아는 비밀 장소',
    x: 50, y: 78,
  },
];

export const REVIEWS: Record<string, Review[]> = {
  'gn-001': [
    {
      id: 1,
      user: '김지우',
      initial: '김',
      rating: 5,
      time: '2시간 전',
      text: '진짜 너무 깨끗해요! 클래식 음악도 나오고 향기도 좋아서 기분 좋게 이용했습니다. 강남역 근처 최고 화장실이에요.',
      tags: ['깨끗함', '향기 좋음'],
      helpful: 12,
    },
    {
      id: 2,
      user: '이민호',
      initial: '이',
      rating: 4,
      time: '어제',
      text: '깔끔하게 관리되고 있네요. 휴지도 넉넉하고 세정제 향이 너무 좋습니다. 자주 이용할 것 같아요.',
      tags: ['청결'],
      helpful: 7,
    },
    {
      id: 3,
      user: '익명의 비밀요원',
      initial: '🤫',
      rating: 5,
      time: '3일 전',
      text: '사람이 거의 없어서 진짜 한가하게 쓸 수 있음. 비밀로 해주세요.',
      tags: ['한가함', '비밀'],
      helpful: 28,
    },
  ],
};

export const FILTERS = {
  basics: [
    { id: 'sep',   label: '남녀분리',    icon: 'wc' as const },
    { id: 'bidet', label: '비데',        icon: 'drop' as const },
    { id: 'paper', label: '휴지',        icon: 'image' as const },
    { id: 'soap',  label: '손세정제',    icon: 'sparkle' as const },
    { id: 'dryer', label: '핸드드라이어', icon: 'wind' as const },
    { id: 'baby',  label: '기저귀교환대', icon: 'baby' as const },
  ],
};
