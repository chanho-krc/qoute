# 📱 오늘의 명언 - 모바일 앱

GitHub 기반 실시간 업데이트가 가능한 React Native 명언 앱입니다.

## ✨ 주요 기능

- 🌐 **GitHub 실시간 업데이트**: APK 업데이트 없이 새로운 명언 추가
- 💾 **스마트 캐싱**: 오프라인에서도 명언 사용 가능  
- 📊 **실시간 상태 모니터링**: 업데이트 상태와 통계 확인
- 🎯 **다양한 카테고리**: 성공, 인생, 도전, 희망, 자기계발
- 🎨 **현대적인 UI**: React Native 기반의 네이티브 성능

## 🚀 개발 환경 설정

### 사전 요구사항
- Node.js 18+
- Expo CLI
- Android Studio (Android 개발시)
- Xcode (iOS 개발시)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 플랫폼별 실행
npm run android  # Android
npm run ios      # iOS  
npm run web      # Web
```

## 🌐 GitHub 연동 시스템

### 데이터 소스
- `github-database/quotes.json`: 명언 데이터베이스
- `github-database/stats.json`: 통계 정보
- 6시간마다 자동으로 GitHub에서 최신 데이터 확인

### 업데이트 프로세스
1. 앱 시작시 로컬 캐시 확인
2. GitHub에서 최신 버전 체크
3. 새로운 데이터가 있으면 자동 다운로드
4. 오프라인시 캐시된 데이터 사용

## 📁 프로젝트 구조

```
my-quote-app/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/
│   │   ├── index.tsx      # 메인 화면
│   │   └── explore.tsx    # 탐색 화면
│   └── _layout.tsx        # 레이아웃
├── components/            # 재사용 컴포넌트
├── data/                  # 데이터 관리
│   ├── quotesDatabase.ts  # 명언 데이터베이스
│   └── remoteQuotesManager.ts # GitHub 연동
├── github-database/       # GitHub 호스팅 데이터
│   ├── quotes.json       # 명언 JSON
│   └── stats.json        # 통계 JSON
└── scripts/              # 유틸리티 스크립트
```

## 🛠️ 기술 스택

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **Networking**: Axios
- **Data Source**: GitHub Pages (JSON)

## 📊 실시간 모니터링

앱에서 확인할 수 있는 정보:
- 📱 총 명언 개수
- 🌐 데이터 소스 (GitHub/Local)
- 💾 캐시된 명언 수
- 🕐 마지막 업데이트 시간
- 🔄 업데이트 필요 여부

## 🔧 빌드 및 배포

```bash
# 개발 빌드
expo build:android
expo build:ios

# 프로덕션 빌드 (EAS Build)
eas build --platform android
eas build --platform ios
```

## 🌟 GitHub 데이터베이스 구조

### quotes.json
```json
{
  "quotes": [
    {
      "id": "1",
      "text": "명언 내용",
      "author": "작가명",
      "category": "카테고리"
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### stats.json
```json
{
  "totalQuotes": 1000,
  "categories": {
    "성공": 200,
    "인생": 200
  },
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

## 📄 라이선스

This project is licensed under the MIT License.
