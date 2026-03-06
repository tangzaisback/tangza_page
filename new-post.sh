#!/bin/bash
# new-post.sh: 새 글 파일을 자동으로 생성해주는 스크립트
# 사용법: ./new-post.sh "글 제목"

if [ -z "$1" ]; then
  echo "❌ 글 제목을 입력해주세요."
  echo "   사용법: ./new-post.sh \"글 제목\""
  exit 1
fi

TITLE="$1"
DATE=$(date +%Y-%m-%d)
# 파일명용으로 공백→하이픈, 특수문자 제거
SLUG=$(echo "$TITLE" | tr ' ' '-')
FILENAME="_posts/${DATE}-${SLUG}.md"

# 이미 파일이 있으면 덮어쓰지 않음
if [ -f "$FILENAME" ]; then
  echo "⚠️  이미 같은 이름의 파일이 있어요: $FILENAME"
  exit 1
fi

# 기본 frontmatter와 함께 파일 생성
cat > "$FILENAME" << EOF
---
layout: post
title: "${TITLE}"
---

여기에 글을 작성하세요.
EOF

echo "✅ 새 글 파일이 생성됐어요!"
echo "   📄 $FILENAME"
echo ""
echo "   아래 명령어로 바로 편집할 수 있어요:"
echo "   open -a 'Visual Studio Code' $FILENAME"
