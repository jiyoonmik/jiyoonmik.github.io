# GitHub Blog

Astro와 Markdown으로 만든 GitHub Pages용 블로그입니다.

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
pubDate: 2026-05-31
tags: ["note"]
---

본문을 Markdown으로 작성합니다.
```

## GitHub Pages 설정

1. GitHub 저장소에 코드를 push합니다.
2. 저장소 `Settings` -> `Pages`로 이동합니다.
3. `Build and deployment`의 Source를 `GitHub Actions`로 설정합니다.
4. `astro.config.mjs`의 `site` 값을 실제 주소로 바꿉니다.
   - 사용자 사이트: `https://username.github.io`
   - 프로젝트 사이트: `https://username.github.io/repository-name`

프로젝트 사이트를 쓴다면 `astro.config.mjs`에 `base: '/repository-name'`도 추가하세요.
