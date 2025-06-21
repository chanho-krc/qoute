// 🤝 크라우드소싱 명언 시스템

export interface UserSubmittedQuote {
  id: string;
  text: string;
  author: string;
  category: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  votes: number;
  reports: number;
}

// 📝 사용자 제출 명언 임시 저장소 (추후 데이터베이스로 이전)
export const pendingQuotes: UserSubmittedQuote[] = [
  // 예시 데이터
  {
    id: "user_001",
    text: "작은 진전도 진전이다.",
    author: "사용자 제출",
    category: "자기계발",
    submittedBy: "user123",
    submittedAt: new Date(),
    status: 'pending',
    votes: 5,
    reports: 0
  }
];

// ✅ 승인된 사용자 제출 명언들
export const approvedUserQuotes: UserSubmittedQuote[] = [];

// 🎯 크라우드소싱 관리 함수들
export class CrowdsourcingManager {
  
  // 📤 새 명언 제출
  static submitQuote(quote: Omit<UserSubmittedQuote, 'id' | 'submittedAt' | 'status' | 'votes' | 'reports'>) {
    const newQuote: UserSubmittedQuote = {
      ...quote,
      id: `user_${Date.now()}`,
      submittedAt: new Date(),
      status: 'pending',
      votes: 0,
      reports: 0
    };
    
    pendingQuotes.push(newQuote);
    console.log('📝 새 명언이 제출되었습니다:', newQuote.text);
    return newQuote.id;
  }

  // 👍 명언에 투표
  static voteQuote(quoteId: string, isUpvote: boolean) {
    const quote = pendingQuotes.find(q => q.id === quoteId);
    if (quote) {
      quote.votes += isUpvote ? 1 : -1;
      console.log(`${isUpvote ? '👍' : '👎'} 투표 완료:`, quote.text);
    }
  }

  // ⚠️ 명언 신고
  static reportQuote(quoteId: string, reason: string) {
    const quote = pendingQuotes.find(q => q.id === quoteId);
    if (quote) {
      quote.reports += 1;
      console.log('⚠️ 신고 접수:', quote.text, '사유:', reason);
    }
  }

  // ✅ 관리자 승인
  static approveQuote(quoteId: string, adminId: string) {
    const quoteIndex = pendingQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex !== -1) {
      const quote = pendingQuotes[quoteIndex];
      quote.status = 'approved';
      quote.approvedBy = adminId;
      quote.approvedAt = new Date();
      
      // 승인된 명언 목록으로 이동
      approvedUserQuotes.push(quote);
      pendingQuotes.splice(quoteIndex, 1);
      
      console.log('✅ 명언 승인됨:', quote.text);
    }
  }

  // ❌ 관리자 거부
  static rejectQuote(quoteId: string, adminId: string) {
    const quote = pendingQuotes.find(q => q.id === quoteId);
    if (quote) {
      quote.status = 'rejected';
      quote.approvedBy = adminId;
      quote.approvedAt = new Date();
      console.log('❌ 명언 거부됨:', quote.text);
    }
  }

  // 📊 통계 조회
  static getStats() {
    return {
      pending: pendingQuotes.length,
      approved: approvedUserQuotes.length,
      totalVotes: pendingQuotes.reduce((sum, q) => sum + q.votes, 0),
      totalReports: pendingQuotes.reduce((sum, q) => sum + q.reports, 0)
    };
  }
}

console.log('🤝 크라우드소싱 시스템 준비 완료!'); 