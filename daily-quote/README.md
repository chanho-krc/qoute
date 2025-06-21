# 🌟 Daily Quote - 오늘의 명언

한국어 명언을 제공하는 React 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📚 550개의 한국어 명언 데이터베이스
- 🎯 카테고리별 명언 분류 (성공, 인생, 도전, 희망, 자기계발)
- 🎨 Material-UI 기반의 현대적인 UI/UX
- 🌙 다크 테마 지원
- ⚡ 실시간 명언 갱신
- 📊 통계 API 지원

## 🚀 시작하기

### 사전 요구사항
- Node.js 16+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (프론트엔드 + 백엔드)
npm run dev

# 또는 개별 실행
npm run server  # 백엔드만 실행 (포트 5000)
npm start       # 프론트엔드만 실행 (포트 3000)
```

## 📡 API 엔드포인트

### 기본 명언 조회
```
GET /api/quote
```

### 카테고리별 명언 조회
```
GET /api/quote/:category
```
지원되는 카테고리: `성공`, `인생`, `도전`, `희망`, `자기계발`

### 전체 명언 목록
```
GET /api/quotes
```

### 통계 정보
```
GET /api/stats
```

## 🏗️ 프로젝트 구조

```
daily-quote/
├── public/          # 정적 파일
├── src/            # React 소스 코드
│   ├── App.tsx     # 메인 컴포넌트
│   └── index.tsx   # 앱 진입점
├── server/         # Express 서버
│   └── index.ts    # 서버 메인 파일
└── package.json    # 프로젝트 설정
```

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Material-UI
- **Backend**: Express.js, Node.js
- **Styling**: Emotion, Material-UI Theme
- **Build**: React Scripts

## 📈 명언 데이터

- 총 550개의 한국어 명언
- 5개 카테고리로 분류
- 유명인사 및 속담 포함
- 인메모리 저장으로 빠른 응답

## 🔧 개발 환경

```bash
# 빌드
npm run build

# 테스트
npm test

# 린팅
npm run lint
```

## 📄 라이선스

This project is licensed under the MIT License.
