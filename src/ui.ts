const ui = {
  backLink: '← 모든 글',
  readingTime: (n: number) => `${n}분 읽기`,
  updated: '업데이트',
  relatedPosts: '관련 글',
  allPosts: '모든 글 →',
  blogEyebrow: 'Archive',
  blogTitle: '모든 글',
  heroTitle: '기록을 남깁니다.',
  heroTitleLine2: '',
  viewAll: '모든 글 →',
  readLink: '읽기 →',
  postFeed: {
    all: '전체',
    filterLabel: '카테고리로 글 필터링',
    previousCategories: '이전 카테고리',
    nextCategories: '다음 카테고리',
    searchLabel: '글 검색',
    empty: '조건에 맞는 글이 없습니다.',
    more: '더 보기',
    read: '읽기',
  },
};

export function getUiText() {
  return ui;
}
