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
    email: 'jiyoonmik@gmail.com', // e.g. 'hello@your-site.com'
    linkedin: 'https://www.linkedin.com/in/jiyoon-kim-5678a2287/', // e.g. 'https://www.linkedin.com/in/yourhandle'
    github: 'https://github.com/jiyoonmik', // e.g. 'https://github.com/yourhandle'
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'June Kim',
    role: 'AI Engineer · Data Scientist',
    location: 'Seoul, Korea',
    focus: 'Anomaly Detection, Graph Modeling, MLOps, AI Engineering',
    lead: '대용량 행동 로그 데이터의 이상 탐지와 그래프 모델링을 통한 사용자 행동 패턴 분석 등 다양한 도메인에서 새로운 기술 연구와 개발을 수행해왔습니다.',
    headline: ['AI와 데이터를 맥락 있게.'],
    statementLabel: 'About',
    statementTitle: '복잡한 문제를 체계적으로 해결하는 AI 엔지니어.',
    statement:
      '모델 개발에서 MLOps, AI Engineering까지 직무 영역을 확장하며 기술적 도전 속에서 지속적인 성장을 추구해왔습니다. 복잡한 문제를 체계적으로 해결하는 것을 즐기며, 함께 성장하는 동료가 되고자 합니다.',
    careerLabel: 'Timeline',
    careerHeading: 'CAREER NARRATIVE & JOURNEY',
    career: [
      {
        period: '2026.03 - Current',
        title: '셀바스AI Edu-Tech',
        description:
          '똑똑수학탐험대 AI 기능 고도화 프로젝트를 수행했습니다. 학생 학습 데이터와 교과 콘텐츠 데이터를 기반으로 맞춤형 학습 추천, Vector & Graph RAG을 다루며 지식 그래프 기반 AI 시스템을 개발하고 있습니다.',
      },
      {
        period: '2023.12 - 2026.02',
        title: '위즈베라 AI팀',
        description:
          'WIZCape 3차부터 6차까지 사용자 행동 분석 및 이상탐지 시스템을 개발했습니다. 직원 행동 로그 데이터를 기반으로 행동 패턴 분석, 이상탐지, Auto Encoder, TGN, Graph Modeling을 수행했습니다.',
      },
      {
        period: '2021.03 - 2023.02',
        title: '이화여대 빅데이터분석학 석사',
        description:
          '학위논문 Diagnostic Classification of Ambient Sensor Data for Aging in Place Smart Home. 노인 일상 행동 데이터와 스마트홈 센서 패턴을 분석해 IADL 수행 능력 진단을 연구했습니다. Bag-Of-Sensors, LSTM, 앙상블 모델을 활용했습니다.',
      },
    ],
    interests: [
      '지식 그래프와 온톨로지 기반 AI 시스템',
      '서비스에 연결되는 AI Engineering',
      'AI Governance와 Responsible AI',
    ],
    interestsLabel: 'Interests',
    interestsHeading: '계속 확장하고 싶은 영역',
  },
};

export default config;
