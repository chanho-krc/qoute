// 🌐 원격 명언 관리 시스템 (GitHub 방식)

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Quote {
  _id: string;
  text: string;
  author: string;
  category: string;
  used: boolean;
  lastUsed?: Date;
  source?: 'manual' | 'scraped' | 'crowdsourced' | 'remote';
}

export interface RemoteQuotesConfig {
  githubUrl: string;
  updateInterval: number; // 시간 (밀리초)
}

// 🎯 원격 명언 관리자 (GitHub 기반)
export class RemoteQuotesManager {
  private static config: RemoteQuotesConfig = {
    // GitHub Raw 파일 URL (실제 사용 시 본인의 GitHub 저장소로 변경)
    githubUrl: 'https://raw.githubusercontent.com/quote-app-db/korean-quotes/main/quotes.json',
    updateInterval: 6 * 60 * 60 * 1000 // 6시간마다 체크 (더 자주 업데이트)
  };

  // 📥 GitHub에서 명언 가져오기
  static async fetchRemoteQuotes(): Promise<Quote[]> {
    try {
      console.log('🌐 GitHub에서 최신 명언 데이터 가져오는 중...');
      
      const response = await fetch(this.config.githubUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const quotes = await response.json();
        console.log(`✅ GitHub에서 ${quotes.length}개 명언 성공적으로 가져옴`);
        return quotes;
      } else {
        console.log(`⚠️ GitHub 응답 오류: ${response.status}`);
        return [];
      }
    } catch (error) {
      console.log('⚠️ GitHub 연결 실패:', error);
      return [];
    }
  }

  // 💾 로컬에 명언 캐시 저장
  static async cacheQuotes(quotes: Quote[]): Promise<void> {
    try {
      const cacheData = {
        quotes: quotes,
        timestamp: Date.now(),
        version: '1.0'
      };
      
      await AsyncStorage.setItem('cached_quotes', JSON.stringify(cacheData));
      await AsyncStorage.setItem('last_update', Date.now().toString());
      console.log(`💾 ${quotes.length}개 명언 로컬 캐시에 저장 완료`);
    } catch (error) {
      console.error('❌ 캐시 저장 실패:', error);
    }
  }

  // 📱 캐시된 명언 불러오기
  static async getCachedQuotes(): Promise<Quote[]> {
    try {
      const cachedData = await AsyncStorage.getItem('cached_quotes');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const quotes = parsed.quotes || parsed; // 구버전 호환성
        console.log(`📱 캐시에서 ${quotes.length}개 명언 로드`);
        return quotes;
      }
      return [];
    } catch (error) {
      console.error('❌ 캐시 로드 실패:', error);
      return [];
    }
  }

  // 🔄 업데이트 필요 여부 확인
  static async needsUpdate(): Promise<boolean> {
    try {
      const lastUpdate = await AsyncStorage.getItem('last_update');
      if (!lastUpdate) {
        console.log('🔄 첫 실행 - 업데이트 필요');
        return true;
      }

      const timeDiff = Date.now() - parseInt(lastUpdate);
      const needsUpdate = timeDiff > this.config.updateInterval;
      
      if (needsUpdate) {
        console.log(`🔄 마지막 업데이트: ${Math.round(timeDiff / (1000 * 60 * 60))}시간 전 - 업데이트 필요`);
      } else {
        console.log(`✅ 최근 업데이트: ${Math.round(timeDiff / (1000 * 60))}분 전 - 업데이트 불필요`);
      }
      
      return needsUpdate;
    } catch (error) {
      return true;
    }
  }

  // 🚀 스마트 명언 로드 (캐시 + 원격 통합)
  static async loadQuotes(): Promise<Quote[]> {
    try {
      console.log('🎯 스마트 명언 로딩 시작...');
      
      // 1. 캐시된 명언 먼저 로드 (빠른 시작)
      const cachedQuotes = await this.getCachedQuotes();
      
      // 2. 업데이트가 필요한지 확인
      const shouldUpdate = await this.needsUpdate();
      
      if (shouldUpdate) {
        console.log('🔄 GitHub에서 최신 명언 확인 중...');
        
        // 3. 백그라운드에서 원격 데이터 가져오기
        const remoteQuotes = await this.fetchRemoteQuotes();
        
        if (remoteQuotes.length > 0) {
          // 4. 새 데이터가 있으면 캐시 업데이트
          await this.cacheQuotes(remoteQuotes);
          console.log('🎉 명언 데이터베이스 업데이트 완료!');
          return remoteQuotes;
        } else {
          console.log('⚠️ 원격 업데이트 실패 - 캐시된 데이터 사용');
        }
      }
      
      // 5. 캐시된 데이터 반환 (오프라인 지원)
      if (cachedQuotes.length > 0) {
        console.log(`📱 캐시된 ${cachedQuotes.length}개 명언 사용`);
        return cachedQuotes;
      } else {
        console.log('🛡️ 폴백 명언 사용');
        return this.getFallbackQuotes();
      }
      
    } catch (error) {
      console.error('❌ 스마트 명언 로드 실패:', error);
      return this.getFallbackQuotes();
    }
  }

  // 🛡️ 폴백 명언 (네트워크 없을 때)
  static getFallbackQuotes(): Quote[] {
    return [
      {
        _id: "fallback_1",
        text: "성공은 준비된 자에게 찾아오는 기회다.",
        author: "루이 파스퇴르",
        category: "성공",
        used: false,
        source: 'manual'
      },
      {
        _id: "fallback_2", 
        text: "인생은 가까이서 보면 비극이지만 멀리서 보면 희극이다.",
        author: "찰리 채플린",
        category: "인생",
        used: false,
        source: 'manual'
      },
      {
        _id: "fallback_3",
        text: "실패를 두려워하지 마라. 시도하지 않는 것을 두려워하라.",
        author: "마이클 조던",
        category: "도전",
        used: false,
        source: 'manual'
      },
      {
        _id: "fallback_4",
        text: "희망은 깃털 달린 새다.",
        author: "에밀리 디킨슨",
        category: "희망",
        used: false,
        source: 'manual'
      },
      {
        _id: "fallback_5",
        text: "배우기를 멈추는 사람은 늙은 것이다. 20세든 80세든.",
        author: "헨리 포드",
        category: "자기계발",
        used: false,
        source: 'manual'
      }
    ];
  }

  // 📊 캐시 상태 확인
  static async getCacheInfo() {
    try {
      const lastUpdate = await AsyncStorage.getItem('last_update');
      const cachedQuotes = await this.getCachedQuotes();
      
      return {
        cachedCount: cachedQuotes.length,
        lastUpdate: lastUpdate ? new Date(parseInt(lastUpdate)) : null,
        needsUpdate: await this.needsUpdate(),
        cacheSize: cachedQuotes.length > 0 ? JSON.stringify(cachedQuotes).length : 0
      };
    } catch (error) {
      return {
        cachedCount: 0,
        lastUpdate: null,
        needsUpdate: true,
        cacheSize: 0
      };
    }
  }

  // 🗑️ 캐시 초기화
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem('cached_quotes');
      await AsyncStorage.removeItem('last_update');
      console.log('🗑️ 캐시 초기화 완료');
    } catch (error) {
      console.error('❌ 캐시 초기화 실패:', error);
    }
  }

  // ⚙️ 설정 업데이트
  static updateConfig(newConfig: Partial<RemoteQuotesConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ 원격 설정 업데이트:', this.config);
  }
}

console.log('🌐 GitHub 기반 원격 명언 관리 시스템 준비 완료!'); 