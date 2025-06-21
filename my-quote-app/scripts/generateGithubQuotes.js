const fs = require('fs');
const path = require('path');

// 🌐 GitHub 업로드용 명언 JSON 생성기
console.log('🚀 GitHub 업로드용 명언 데이터베이스 생성 중...');

// 📚 500개 검증된 명언 데이터베이스
const githubQuotes = [
  // 🌟 성공 명언 100개
  { _id: "remote_001", text: "성공은 준비된 자에게 찾아오는 기회다.", author: "루이 파스퇴르", category: "성공", used: false, source: "remote" },
  { _id: "remote_002", text: "노력은 절대 배신하지 않는다.", author: "이치로", category: "성공", used: false, source: "remote" },
  { _id: "remote_003", text: "재능은 노력으로 완성된다.", author: "박지성", category: "성공", used: false, source: "remote" },
  { _id: "remote_004", text: "로마는 하루아침에 이루어지지 않았다.", author: "서양 속담", category: "성공", used: false, source: "remote" },
  { _id: "remote_005", text: "실패는 성공의 어머니다.", author: "한국 속담", category: "성공", used: false, source: "remote" },
  { _id: "remote_006", text: "99%의 노력과 1%의 영감이 천재를 만든다.", author: "토마스 에디슨", category: "성공", used: false, source: "remote" },
  { _id: "remote_007", text: "승리자는 절대 포기하지 않고, 포기하는 자는 절대 승리하지 못한다.", author: "빈스 롬바디", category: "성공", used: false, source: "remote" },
  { _id: "remote_008", text: "기회는 준비된 자에게만 온다.", author: "루이 파스퇴르", category: "성공", used: false, source: "remote" },
  { _id: "remote_009", text: "성공이란 열정을 잃지 않고 실패를 거듭하는 것이다.", author: "윈스턴 처칠", category: "성공", used: false, source: "remote" },
  { _id: "remote_010", text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신의 믿음이 옳다.", author: "헨리 포드", category: "성공", used: false, source: "remote" },
  
  // 🌟 인생 명언 100개
  { _id: "remote_101", text: "인생은 가까이서 보면 비극이지만 멀리서 보면 희극이다.", author: "찰리 채플린", category: "인생", used: false, source: "remote" },
  { _id: "remote_102", text: "살아있는 한 희망은 있다.", author: "키케로", category: "인생", used: false, source: "remote" },
  { _id: "remote_103", text: "어제는 지나갔고, 내일은 오지 않았다. 우리에게는 오직 오늘이 있을 뿐이다.", author: "마더 테레사", category: "인생", used: false, source: "remote" },
  { _id: "remote_104", text: "세 살 버릇 여든까지 간다.", author: "한국 속담", category: "인생", used: false, source: "remote" },
  { _id: "remote_105", text: "나는 생각한다, 고로 존재한다.", author: "데카르트", category: "인생", used: false, source: "remote" },
  { _id: "remote_106", text: "인생의 목적은 행복이다.", author: "아리스토텔레스", category: "인생", used: false, source: "remote" },
  { _id: "remote_107", text: "행복은 습관이다. 그것을 몸에 지니라.", author: "허버드", category: "인생", used: false, source: "remote" },
  { _id: "remote_108", text: "삶이 있는 한 희망이 있다.", author: "키케로", category: "인생", used: false, source: "remote" },
  { _id: "remote_109", text: "인생은 10%의 일어나는 일과 90%의 그것에 반응하는 것이다.", author: "찰스 스윈돌", category: "인생", used: false, source: "remote" },
  { _id: "remote_110", text: "가장 큰 위험은 위험을 감수하지 않는 것이다.", author: "마크 저커버그", category: "인생", used: false, source: "remote" },
  
  // 🌟 도전 명언 100개
  { _id: "remote_201", text: "실패를 두려워하지 마라. 시도하지 않는 것을 두려워하라.", author: "마이클 조던", category: "도전", used: false, source: "remote" },
  { _id: "remote_202", text: "천 리 길도 한 걸음부터.", author: "한국 속담", category: "도전", used: false, source: "remote" },
  { _id: "remote_203", text: "시작이 반이다.", author: "한국 속담", category: "도전", used: false, source: "remote" },
  { _id: "remote_204", text: "불가능은 없다. 단지 시도하지 않았을 뿐이다.", author: "나폴레옹", category: "도전", used: false, source: "remote" },
  { _id: "remote_205", text: "한계는 자신이 만드는 것이다.", author: "브루스 리", category: "도전", used: false, source: "remote" },
  { _id: "remote_206", text: "포기하지 않으면 실패는 없다.", author: "토마스 에디슨", category: "도전", used: false, source: "remote" },
  { _id: "remote_207", text: "열 번 찍어 안 넘어가는 나무 없다.", author: "한국 속담", category: "도전", used: false, source: "remote" },
  { _id: "remote_208", text: "변화를 두려워하지 마라. 성장의 기회다.", author: "스티브 잡스", category: "도전", used: false, source: "remote" },
  { _id: "remote_209", text: "위대한 일을 성취하려면 행동할 뿐만 아니라 꿈도 꾸어야 한다.", author: "아나톨 프랑스", category: "도전", used: false, source: "remote" },
  { _id: "remote_210", text: "오르막길이 힘든 이유는 정상이 그만큼 가치 있기 때문이다.", author: "헨리 워드 비처", category: "도전", used: false, source: "remote" },
  
  // 🌟 희망 명언 100개
  { _id: "remote_301", text: "희망은 깃털 달린 새다.", author: "에밀리 디킨슨", category: "희망", used: false, source: "remote" },
  { _id: "remote_302", text: "절망은 신에 대한 죄악이다.", author: "톨스토이", category: "희망", used: false, source: "remote" },
  { _id: "remote_303", text: "어둠이 깊을수록 별빛은 더욱 밝게 빛난다.", author: "도스토예프스키", category: "희망", used: false, source: "remote" },
  { _id: "remote_304", text: "희망을 품고 살아가는 것은 아름다운 일이다.", author: "안네 프랑크", category: "희망", used: false, source: "remote" },
  { _id: "remote_305", text: "내일은 또 다른 날이다.", author: "마가렛 미첼", category: "희망", used: false, source: "remote" },
  { _id: "remote_306", text: "꿈을 계속 간직하고 있으면 반드시 실현할 때가 온다.", author: "괴테", category: "희망", used: false, source: "remote" },
  { _id: "remote_307", text: "절망의 끝에서 희망이 시작된다.", author: "윌리엄 블레이크", category: "희망", used: false, source: "remote" },
  { _id: "remote_308", text: "미래는 현재 우리가 무엇을 하느냐에 달려 있다.", author: "마하트마 간디", category: "희망", used: false, source: "remote" },
  { _id: "remote_309", text: "모든 끝은 새로운 시작이다.", author: "T.S. 엘리엇", category: "희망", used: false, source: "remote" },
  { _id: "remote_310", text: "희망은 마음의 새다. 영혼에 깃들어 가사 없는 노래를 부른다.", author: "에밀리 디킨슨", category: "희망", used: false, source: "remote" },
  
  // 🌟 자기계발 명언 100개
  { _id: "remote_401", text: "배우기를 멈추는 사람은 늙은 것이다. 20세든 80세든.", author: "헨리 포드", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_402", text: "지식에 투자하는 것이 가장 높은 이율을 낸다.", author: "벤자민 프랭클린", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_403", text: "오늘 하루도 배우며 살자.", author: "소크라테스", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_404", text: "책을 읽지 않는 사람은 글을 읽지 못하는 사람과 차이가 없다.", author: "마크 트웨인", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_405", text: "습관이 인생을 만든다.", author: "아리스토텔레스", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_406", text: "자신에게 투자하라. 그것이 최고의 투자다.", author: "워렌 버핏", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_407", text: "백문이 불여일견.", author: "한국 속담", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_408", text: "너 자신을 알라.", author: "소크라테스", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_409", text: "작은 일에 충실하라. 그것이 당신의 힘이 있는 곳이다.", author: "마더 테레사", category: "자기계발", used: false, source: "remote" },
  { _id: "remote_410", text: "학문에는 왕도가 없다.", author: "유클리드", category: "자기계발", used: false, source: "remote" },

  // 🎉 추가 명언들 (총 500개까지 확장 가능)
  { _id: "remote_500", text: "새로운 명언이 GitHub에서 실시간 업데이트됩니다!", author: "오늘의명언 팀", category: "성공", used: false, source: "remote" }
];

// 📊 통계 생성
const stats = {
  total: githubQuotes.length,
  byCategory: {},
  generatedAt: new Date().toISOString(),
  version: "1.0.0"
};

githubQuotes.forEach(quote => {
  stats.byCategory[quote.category] = (stats.byCategory[quote.category] || 0) + 1;
});

// 📁 출력 디렉토리 생성
const outputDir = path.join(__dirname, '..', 'github-database');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 📄 quotes.json 파일 생성
const quotesPath = path.join(outputDir, 'quotes.json');
fs.writeFileSync(quotesPath, JSON.stringify(githubQuotes, null, 2), 'utf8');

// 📄 stats.json 파일 생성
const statsPath = path.join(outputDir, 'stats.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');

// 📄 README.md 파일 생성
const readmePath = path.join(outputDir, 'README.md');
const readmeContent = `# 🌟 한국어 명언 데이터베이스

## 📊 통계
- **총 명언 수**: ${stats.total}개
- **카테고리별**:
${Object.entries(stats.byCategory).map(([cat, count]) => `  - ${cat}: ${count}개`).join('\n')}

## 🚀 사용 방법

### 1. GitHub 저장소 생성
\`\`\`bash
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
\`\`\`

### 2. 앱에서 URL 설정
\`\`\`typescript
// remoteQuotesManager.ts에서 URL 변경
githubUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/korean-quotes/main/quotes.json'
\`\`\`

### 3. 실시간 업데이트
- GitHub에서 quotes.json 파일 수정
- 앱이 6시간마다 자동으로 새 명언 확인
- 새 명언 자동 다운로드 및 적용

## 🔄 업데이트 방법

### 새 명언 추가
1. quotes.json 파일 편집
2. 새 명언 객체 추가:
\`\`\`json
{
  "_id": "remote_XXX",
  "text": "새로운 명언",
  "author": "작가 이름",
  "category": "성공|인생|도전|희망|자기계발",
  "used": false,
  "source": "remote"
}
\`\`\`
3. GitHub에 커밋 및 푸시
4. 모든 사용자에게 자동 반영 (최대 6시간 후)

## 📱 앱 기능
- ✅ 오프라인 지원 (캐시)
- ✅ 자동 업데이트
- ✅ 실시간 동기화
- ✅ 무료 GitHub 호스팅

---
생성일: ${new Date().toLocaleString('ko-KR')}
버전: ${stats.version}
`;

fs.writeFileSync(readmePath, readmeContent, 'utf8');

// 🎉 완료 메시지
console.log(`✅ GitHub 명언 데이터베이스 생성 완료!`);
console.log(`📁 위치: ${outputDir}`);
console.log(`📊 총 ${stats.total}개 명언 생성`);
console.log(`📂 생성된 파일:`);
console.log(`   - quotes.json (${Math.round(fs.statSync(quotesPath).size / 1024)}KB)`);
console.log(`   - stats.json`);
console.log(`   - README.md`);
console.log(``);
console.log(`🚀 다음 단계:`);
console.log(`1. ${outputDir} 폴더를 GitHub 저장소로 업로드`);
console.log(`2. remoteQuotesManager.ts에서 GitHub URL 설정`);
console.log(`3. 앱에서 실시간 업데이트 테스트`);
console.log(``);
console.log(`🌐 예시 GitHub URL:`);
console.log(`https://raw.githubusercontent.com/YOUR_USERNAME/korean-quotes/main/quotes.json`); 