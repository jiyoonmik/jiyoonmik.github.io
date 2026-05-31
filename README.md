# Jiyoon Blog

Astro Tone 테마와 Markdown으로 만든 GitHub Pages용 블로그입니다.

## 로컬 실행

이 컴퓨터에는 현재 `npm`이 PATH에 없어서, Node 패키지 매니저를 설치한 뒤 아래 명령을 실행하세요.

```bash
npm install
npm run dev
```

## 글 작성

새 글은 `src/content/blog` 폴더에 Markdown 파일로 추가합니다.

```markdown
---
title: "글 제목"
description: "글 설명"
pubDate: "2026-05-31"
category: "Notes"
---

본문을 Markdown으로 작성합니다.
```

## GitHub Pages 설정

1. GitHub 저장소에 코드를 push합니다.
2. 저장소 `Settings` -> `Pages`로 이동합니다.
3. `Build and deployment`의 Source를 `GitHub Actions`로 설정합니다.
4. 사이트 이름, 소개 문구, 프로필 내용은 `astro-theme-config.ts`에서 수정합니다.

사용자 사이트 저장소(`jiyoonmik.github.io`)는 루트 주소로 배포됩니다. 프로젝트 저장소에 배포하면 GitHub Actions가 저장소 이름을 기준으로 `base` 값을 자동 설정합니다.
