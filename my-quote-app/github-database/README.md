# 🌟 한국어 명언 데이터베이스

## 📊 통계
- **총 명언 수**: 51개
- **카테고리별**:
  - 성공: 11개
  - 인생: 10개
  - 도전: 10개
  - 희망: 10개
  - 자기계발: 10개

## 🚀 사용 방법

### 1. GitHub 저장소 생성
```bash
# 새 저장소 생성
git init korean-quotes
cd korean-quotes

# 파일 복사
cp quotes.json ./
cp stats.json ./
cp README.md ./

# GitHub에 업로드
git add .
git commit -m "Initial commit: Korean quotes database"
git remote add origin https://github.com/YOUR_USERNAME/korean-quotes.git
git push -u origin main
```

### 2. 앱에서 URL 설정
```typescript
// remoteQuotesManager.ts에서 URL 변경
githubUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/korean-quotes/main/quotes.json'
```

### 3. 실시간 업데이트
- GitHub에서 quotes.json 파일 수정
- 앱이 6시간마다 자동으로 새 명언 확인
- 새 명언 자동 다운로드 및 적용

## 🔄 업데이트 방법

### 새 명언 추가
1. quotes.json 파일 편집
2. 새 명언 객체 추가:
```json
{
  "_id": "remote_XXX",
  "text": "새로운 명언",
  "author": "작가 이름",
  "category": "성공|인생|도전|희망|자기계발",
  "used": false,
  "source": "remote"
}
```
3. GitHub에 커밋 및 푸시
4. 모든 사용자에게 자동 반영 (최대 6시간 후)

## 📱 앱 기능
- ✅ 오프라인 지원 (캐시)
- ✅ 자동 업데이트
- ✅ 실시간 동기화
- ✅ 무료 GitHub 호스팅

---
생성일: 2025. 6. 21. 오후 11:24:15
버전: 1.0.0
