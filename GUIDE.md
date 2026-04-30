# 돌아온 탕자 — 운영 가이드

## 로컬 서버

```bash
bundle exec jekyll serve   # http://localhost:4001
bundle exec jekyll build   # 빌드만
```

---

## 새 글 쓰기

### 스크립트 사용 (권장)

```bash
./new-post.sh "글 제목"
```

`_posts/YYYY-MM-DD-글-제목.md` 파일이 자동 생성된다.

### 직접 생성

파일명 규칙: `_posts/YYYY-MM-DD-제목.md`

```yaml
---
layout: post
title: "제목"
category: "이것저것 설명하기"
---

본문 내용
```

### 카테고리 (writing.html 탭 필터와 정확히 일치해야 함)

| 값 | 용도 |
|----|------|
| `이것저것 설명하기` | 일상, 생각, 에세이 |
| `보고듣고 감상하기` | 영화, 음악, 책 감상 |
| `뚱땅뚱땅 개발하기` | 개발 관련 글 |

카테고리를 생략하면 탭 필터에서 "전체"에만 노출된다.

---

## 사진 추가 (`필름` 페이지)

### 스크립트 사용 (권장)

```bash
# 1. 원본 파일을 images/ 또는 images/originals/ 에 복사
# 2. 스크립트 실행
./new-photo.sh 파일명.jpg "사진 제목"
```

스크립트가 자동으로 처리하는 것:
- 원본 → `images/originals/` 이동
- 압축본(1200px, 품질 75%) → `images/` 생성
- `_data/photos.yml` 하단에 항목 추가

### 직접 등록 (`_data/photos.yml`)

```yaml
- image: "파일명.jpg"          # images/ 경로의 압축본
  original: "originals/파일명.jpg"  # images/originals/ 경로의 원본
  title: "사진 제목"
```

- `image`: 그리드에 표시되는 썸네일 경로 (파일명만, `images/` 생략)
- `original`: lightbox 클릭 시 표시되는 원본 경로
- 목록 순서 = 페이지 표시 순서 (위가 최신)

### 이미지 저장 위치 요약

| 경로 | 용도 |
|------|------|
| `images/파일명.jpg` | 압축본 (썸네일, 페이지 표시용) |
| `images/originals/파일명.jpg` | 원본 (lightbox 전체화면용) |

---

## 프로젝트 추가 (`프로젝트` 페이지)

`_data/projects.yml` 에 항목 추가:

```yaml
- title: "프로젝트 이름"
  description: "한두 줄 설명"
  url: "https://링크"
  image: "파일명.jpg"    # images/ 폴더에 있는 파일명. 없으면 "" (빈 문자열 → 배경색으로 대체)
  target: "_blank"       # 새 탭: "_blank" / 현재 탭: "_self"
```

프로젝트 이미지는 `images/` 에 저장. `originals/` 불필요.

---

## 에셋 위치 요약

| 경로 | 내용 |
|------|------|
| `assets/css/style.css` | 모든 스타일. CSS 변수로 라이트/다크 분기 |
| `assets/js/main.js` | 다크모드, 스크롤 애니메이션, Firebase 좋아요 |
| `images/` | 사진 압축본, 프로젝트 이미지 |
| `images/originals/` | 사진 원본 (lightbox용) |
| `_data/photos.yml` | 필름 페이지 사진 목록 |
| `_data/projects.yml` | 프로젝트 페이지 목록 |
| `_posts/` | 글 마크다운 파일 |
| `_layouts/` | 페이지 기본 레이아웃 |
| `_includes/` | 헤더 등 공통 조각 |

---

## 디자인 토큰 (CSS 변수)

`assets/css/style.css` 에서 관리. 색을 바꿀 때는 변수만 수정하면 된다.

| 변수 | 라이트 | 다크 | 역할 |
|------|--------|------|------|
| `--bg-color` | `#faf9f6` | `#1a1917` | 배경 |
| `--text-main` | `#1c1b19` | `#e8e4dc` | 본문 텍스트 |
| `--text-muted` | `#6e6c66` | — | 보조 텍스트 |
| `--text-date` | `#a09d97` | — | 날짜 |
| `--border-color` | `#e5e2db` | `#2e2c29` | 구분선 |
| `--hover-bg` | `#f3f1ec` | — | 호버 배경 |
| `--accent` | `#c17a5a` | `#c17a5a` | 테라코타 포인트 색 |

액센트 색 적용 위치: nav 호버 언더라인, 카테고리 탭 활성, 좋아요 버튼 liked 상태.

---

## 배포

GitHub Pages 자동 배포. `web` 브랜치에 push하면 빌드 후 자동 반영된다.

```bash
git add .
git commit -m "설명"
git push origin web
```

반영 시간은 보통 1~2분.

---

## 주의사항

- `_config.yml` 수정 후에는 로컬 서버를 재시작해야 반영된다 (`Ctrl+C` → 재실행).
- `new-photo.sh`는 macOS의 `sips` 명령어를 사용하므로 Windows에서는 수동으로 이미지를 압축해야 한다.
- `photos.yml`에 이미 등록된 파일명으로 `new-photo.sh`를 실행하면 중복 등록을 방지하고 종료된다.
- `projects.yml`의 `image: ""`는 Liquid에서 truthy로 처리되므로, 이미지 없는 카드는 반드시 `image: ""`로 두되 템플릿에서 `{% if project.image != "" %}` 조건으로 처리한다 (이미 적용됨).
