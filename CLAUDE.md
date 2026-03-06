# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 로컬 서버 실행 (포트 4001 고정)
bundle exec jekyll serve

# 빌드만 (서버 없이)
bundle exec jekyll build

# 새 글 생성
./new-post.sh "글 제목"

# 새 사진 등록 (압축 + photos.yml 자동 추가)
./new-photo.sh 파일명.jpg "사진 제목"
```

## 아키텍처

Jekyll 기반 정적 사이트. 테마 없이 완전 커스텀 CSS/JS로 구성되어 있다.

### 페이지 구조

| 페이지 | 파일 | 역할 |
|--------|------|------|
| 대문 | `index.html` | 최근 글 3개 + 최근 사진 3개 매거진형 홈 |
| 지면 | `writing.html` | 전체 포스트 목록 + 카테고리 탭 필터 |
| 필름 | `photo.html` | `_data/photos.yml` 기반 사진 그리드 |
| 소개 | `about.markdown` | 소개 페이지 |

### 레이아웃

- `_layouts/default.html` — 모든 페이지의 기반. 헤더, Google Fonts(Orbit), main.js, basicLightbox CDN 포함. 다크모드 초기화 인라인 스크립트 포함.
- `_layouts/post.html` — 글 상세 페이지. Firebase 좋아요 버튼(토마토 이모지) 포함.
- `_includes/header.html` — 사이트 공통 헤더. 지면/필름/소개 링크 + 다크모드 토글 버튼.

### JS (`assets/js/main.js`)

세 가지 기능이 하나의 파일에 있다:
1. **다크모드 토글** — `data-theme` 속성과 `localStorage`로 상태 유지
2. **스크롤 인트로 애니메이션** — `.reveal-on-scroll` 클래스에 IntersectionObserver 적용, 노출 시 `.is-visible` 추가
3. **Firebase 좋아요** — Firebase Realtime Database에 익명 카운트 저장. `_layouts/post.html`의 `#like-btn`에서만 동작.

`writing.html`의 카테고리 탭 필터는 `main.js`가 아닌 해당 페이지 인라인 JS로 처리한다.

### CSS (`assets/css/style.css`)

단일 파일. CSS 변수로 라이트/다크 테마를 분기한다.

```css
/* 주요 변수 */
--text-main      /* 메인 텍스트 색상 */
--text-muted     /* 보조 텍스트 색상 */
--border-color   /* 테두리 색상 */
--hover-bg       /* 호버 배경 색상 */
```

다크모드는 `[data-theme="dark"]` 선택자로 변수 재정의. 폰트는 Orbit(Google Fonts) 하나만 사용.

### 포스트

`_posts/YYYY-MM-DD-제목.md` 형식. front matter:

```yaml
---
layout: post
title: "제목"
category: "이것저것 설명하기"  # 또는 "보고듣고 감상하기" / "뚱땅뚱땅 개발하기"
---
```

카테고리는 `writing.html` 탭 필터의 `data-filter` 값과 정확히 일치해야 한다.

### 사진

`_data/photos.yml`에 목록 관리. 이미지는 두 벌 보관:
- `images/파일명.jpg` — 압축본 (1200px, 품질 75%, `new-photo.sh`가 자동 생성)
- `images/originals/파일명.jpg` — 원본 (lightbox 클릭 시 표시)
