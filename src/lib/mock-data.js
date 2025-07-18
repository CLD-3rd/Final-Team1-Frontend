// src/lib/mock-data.js

export const TEST_ACCOUNTS = [
  {
    id: "1",
    name: "김테스트",
    email: "test@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "이개발",
    email: "dev@example.com",
    password: "dev123",
  },
]

export const MOCK_TEST_HISTORY = [
  {
    id: "1",
    personality: "외향적 리더형",
    score: 4.2,
    completedAt: "2024-01-15T10:30:00Z",
    answers: {}, // 실제 답변 데이터는 필요에 따라 추가
  },
  {
    id: "2",
    personality: "균형잡힌 분석형",
    score: 3.8,
    completedAt: "2024-01-10T14:20:00Z",
    answers: {},
  },
]

export const MOCK_RECOMMENDATIONS = {
  "외향적 리더형": {
    movies: [
      { title: "어벤져스: 엔드게임", description: "영웅들의 마지막 전투" },
      { title: "인터스텔라", description: "우주를 향한 인류의 도전" },
      { title: "다크 나이트", description: "정의와 악의 대결" },
      { title: "인셉션", description: "꿈 속의 꿈" },
      { title: "매드 맥스: 분노의 도로", description: "포스트 아포칼립스 액션" },
    ],
    books: [
      { title: "리더십의 정석", author: "존 맥스웰", description: "리더십 개발 가이드" },
      { title: "성공하는 사람들의 7가지 습관", author: "스티븐 코비", description: "성공을 위한 습관들" },
      { title: "생각에 관한 생각", author: "다니엘 카너먼", description: "인간의 사고 과정 분석" },
      { title: "넛지", author: "리처드 탈러", description: "선택 설계의 힘" },
      { title: "린 스타트업", author: "에릭 리스", description: "혁신적 창업 방법론" },
    ],
    music: [
      { name: "Imagine Dragons", genre: "얼터너티브 록", description: "에너지 넘치는 록 밴드" },
      { name: "OneRepublic", genre: "팝 록", description: "감성적인 팝 록" },
      { name: "Maroon 5", genre: "팝", description: "캐치한 팝 음악" },
      { name: "Coldplay", genre: "얼터너티브 록", description: "몽환적인 록 사운드" },
      { name: "The Chainsmokers", genre: "EDM", description: "댄스 일렉트로닉" },
    ],
  },
  "균형잡힌 분석형": {
    movies: [
      { title: "쇼생크 탈출", description: "희망에 관한 이야기" },
      { title: "포레스트 검프", description: "인생의 여정" },
      { title: "굿 윌 헌팅", description: "재능과 성장" },
      { title: "어바웃 타임", description: "시간과 사랑" },
      { title: "라라랜드", description: "꿈과 현실" },
    ],
    books: [
      { title: "사피엔스", author: "유발 하라리", description: "인류의 역사" },
      { title: "총, 균, 쇠", author: "재레드 다이아몬드", description: "문명의 발전" },
      { title: "팩트풀니스", author: "한스 로슬링", description: "데이터로 보는 세상" },
      { title: "코스모스", author: "칼 세이건", description: "우주에 대한 탐구" },
      { title: "정의란 무엇인가", author: "마이클 샌델", description: "도덕 철학" },
    ],
    music: [
      { name: "Ed Sheeran", genre: "팝", description: "감성적인 싱어송라이터" },
      { name: "John Mayer", genre: "블루스 록", description: "기타 연주의 대가" },
      { name: "Adele", genre: "소울", description: "강력한 보컬" },
      { name: "Sam Smith", genre: "팝", description: "감성적인 발라드" },
      { name: "Billie Eilish", genre: "얼터너티브 팝", description: "독특한 음악 스타일" },
    ],
  },
  "신중한 사색형": {
    movies: [
      { title: "기생충", description: "사회적 메시지가 담긴 작품" },
      { title: "올드보이", description: "복수와 운력" },
      { title: "버드맨", description: "예술가의 고뇌" },
      { title: "문라이트", description: "정체성에 대한 탐구" },
      { title: "노마드랜드", description: "현대 사회의 고독" },
    ],
    books: [
      { title: "1984", author: "조지 오웰", description: "디스토피아 소설" },
      { title: "멋진 신세계", author: "올더스 헉슬리", description: "미래 사회 비판" },
      { title: "카라마조프 가의 형제들", author: "도스토예프스키", description: "인간 본성 탐구" },
      { title: "백년의 고독", author: "가브리엘 가르시아 마르케스", description: "마술적 리얼리즘" },
      { title: "데미안", author: "헤르만 헤세", description: "성장과 자아 발견" },
    ],
    music: [
      { name: "Radiohead", genre: "얼터너티브 록", description: "실험적인 록 음악" },
      { name: "Bon Iver", genre: "인디 포크", description: "몽환적인 포크" },
      { name: "Sufjan Stevens", genre: "인디 포크", description: "서정적인 음악" },
      { name: "The National", genre: "인디 록", description: "우울한 감성의 록" },
      { name: "Arcade Fire", genre: "인디 록", description: "웅장한 인디 록" },
    ],
  },
}
