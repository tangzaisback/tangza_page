#!/bin/bash
# new-photo.sh (업그레이드 버전): 원본 저장 + 자동 압축 + photos.yml 자동 등록
# 사용법: ./new-photo.sh 파일명.jpg "사진 제목"
# 예시:   ./new-photo.sh photo6.jpg "2024 제주"
#
# ✅ 원본은 images/originals/ 에 보관됩니다.
# ✅ 압축 버전(1200px, 품질 75%)은 images/ 에 생성됩니다.
# ✅ photos.yml에 자동으로 두 경로(image + original)가 등록됩니다.

PHOTOS_YML="_data/photos.yml"
ORIGINALS_DIR="images/originals"
THUMBS_DIR="images"

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ 파일명과 제목을 모두 입력해주세요."
  echo "   사용법: ./new-photo.sh 파일명.jpg \"사진 제목\""
  echo "   예시:   ./new-photo.sh photo6.jpg \"2024 제주\""
  exit 1
fi

IMAGE="$1"
TITLE="$2"

# originals 폴더가 없으면 생성
mkdir -p "$ORIGINALS_DIR"

# 원본 파일 확인 (images/ 또는 images/originals/ 에 있는지)
if [ -f "$THUMBS_DIR/$IMAGE" ] && [ ! -f "$ORIGINALS_DIR/$IMAGE" ]; then
  # images/ 에 있는 경우 → originals/ 로 이동
  echo "📦 원본을 $ORIGINALS_DIR/ 로 이동합니다..."
  mv "$THUMBS_DIR/$IMAGE" "$ORIGINALS_DIR/$IMAGE"
elif [ ! -f "$ORIGINALS_DIR/$IMAGE" ]; then
  echo "❌ 이미지 파일을 찾을 수 없어요: $IMAGE"
  echo "   먼저 images/ 또는 images/originals/ 폴더에 파일을 넣어주세요."
  exit 1
fi

# 이미 photos.yml에 중복 등록 여부 확인
if grep -q "\"$IMAGE\"" "$PHOTOS_YML"; then
  echo "⚠️  이미 photos.yml에 $IMAGE 가 등록되어 있어요."
  exit 1
fi

# 압축 버전 생성 (가로 1200px, 품질 75%)
echo "🔧 압축 버전을 생성하는 중..."
sips --resampleWidth 1200 "$ORIGINALS_DIR/$IMAGE" --out "$THUMBS_DIR/$IMAGE" -s formatOptions 75 > /dev/null 2>&1

ORIGINAL_SIZE=$(du -sh "$ORIGINALS_DIR/$IMAGE" | cut -f1)
THUMB_SIZE=$(du -sh "$THUMBS_DIR/$IMAGE" | cut -f1)
echo "   원본: $ORIGINAL_SIZE → 압축: $THUMB_SIZE"

# photos.yml에 새 항목 추가
echo "- image: \"${IMAGE}\"" >> "$PHOTOS_YML"
echo "  original: \"originals/${IMAGE}\"" >> "$PHOTOS_YML"
echo "  title: \"${TITLE}\"" >> "$PHOTOS_YML"

echo ""
echo "✅ 사진이 등록됐어요!"
echo "   🖼️  썸네일: images/$IMAGE ($THUMB_SIZE)"
echo "   📁 원본:   images/originals/$IMAGE ($ORIGINAL_SIZE)"
echo "   📝 제목:   $TITLE"
echo ""
echo "   반영하려면:"
echo "   bundle exec jekyll build"
