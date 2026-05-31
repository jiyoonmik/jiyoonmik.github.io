type NavItem = {
  label: string;
  href: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Astro Tone theme.
 * Most site-level customization should happen in this file.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://jiyoonmik.github.io',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '',
    lang: 'ko',
    locale: 'ko_KR',
    dateLocale: 'ko-KR',
    title: 'Jiyoon Blog',
    logoLabel: 'Jiyoon',
    description: '배운 것과 만든 것을 차분히 기록하는 개인 블로그입니다.',
    author: 'jiyoonmik',
    /** Optional absolute or root-relative image URL for homepage/search/about social previews. */
    defaultOgImage: '/og.png',
  },

  // The logo already links to `/`. Add items here if you want visible header links.
  // Example: [{ label: 'Blog', href: '/blog' }, { label: 'About', href: '/about' }]
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  content: {
    categoryOrder: [
      'Notes',
      'Tech',
      'Projects',
      'Design',
      'Getting Started',
      'Markdown',
      'Open Source',
      'Systems',
      'Research',
      'Performance',
      'MDX',
    ],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Astro Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  social: {
    website: 'https://jiyoonmik.github.io', // e.g. 'https://your-site.com'
    email: '', // e.g. 'hello@your-site.com'
    linkedin: '', // e.g. 'https://www.linkedin.com/in/yourhandle'
    github: 'https://github.com/jiyoonmik', // e.g. 'https://github.com/yourhandle'
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'jiyoonmik',
    role: '배운 것과 만든 것을 기록합니다.',
    location: 'Seoul, Korea',
    focus: '기술, 프로젝트, 오래 남길 메모.',
    lead: '배운 것, 만든 것, 다시 꺼내 보고 싶은 생각을 기록하는 공간입니다.',
    headline: ['Notes worth', 'returning to.'],
    statementLabel: 'About',
    statementTitle: '차분히 쌓아가는 기록.',
    statement:
      'GitHub 저장소에서 글과 코드를 함께 관리하고, Markdown으로 작성한 글을 Astro가 정적 페이지로 빌드합니다.',
    careerLabel: 'Now',
    careerHeading: '기록하는 것들',
    career: [
      {
        period: 'Notes',
        title: '학습 기록',
        description: '새로 배운 개념과 시행착오를 짧고 명확하게 정리합니다.',
      },
      {
        period: 'Projects',
        title: '프로젝트 기록',
        description: '만든 것의 의도, 구조, 개선점을 남깁니다.',
      },
      {
        period: 'Archive',
        title: '참고 자료',
        description: '나중에 다시 볼 만한 자료와 생각을 모읍니다.',
      },
    ],
    interests: [
      '잘 읽히는 기술 문서',
      '작게 만들고 자주 개선하는 프로젝트',
      '시간이 지나도 다시 이해되는 기록',
    ],
    interestsLabel: 'Interests',
    interestsHeading: '관심 있는 주제',
  },
};

export default config;
