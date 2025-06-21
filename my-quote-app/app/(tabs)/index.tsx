import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { loadSmartQuotes, getRemoteUpdateStatus, Quote } from '@/data/quotesDatabase';

export default function HomeScreen() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<any>(null);

  // 🚀 GitHub 기반 스마트 명언 로드
  useEffect(() => {
    loadQuotesFromGitHub();
    checkUpdateStatus();
    
    // 알림 클릭 리스너 설정
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('알림 받음:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('알림 클릭됨:', response);
      // 알림 클릭 시 새로운 명언 표시
      getNewQuote();
    });

    return () => {
      notificationListener && Notifications.removeNotificationSubscription(notificationListener);
      responseListener && Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const loadQuotesFromGitHub = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 GitHub 명언 로딩 시작...');
      
      const loadedQuotes = await loadSmartQuotes();
      setQuotes(loadedQuotes);
      
      if (loadedQuotes.length > 0) {
        const randomQuote = loadedQuotes[Math.floor(Math.random() * loadedQuotes.length)];
        setCurrentQuote(randomQuote);
        console.log(`✅ ${loadedQuotes.length}개 명언 로드 완료`);
      }
    } catch (error) {
      console.error('❌ 명언 로드 실패:', error);
      Alert.alert('오류', '명언을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUpdateStatus = async () => {
    try {
      const status = await getRemoteUpdateStatus();
      setUpdateStatus(status);
      console.log('📊 업데이트 상태:', status);
    } catch (error) {
      console.log('⚠️ 업데이트 상태 확인 실패:', error);
    }
  };

  const getNewQuote = () => {
    if (quotes.length === 0) return;
    
    const availableQuotes = quotes.filter(q => q._id !== currentQuote?._id);
    if (availableQuotes.length === 0) {
      // 모든 명언을 다 봤으면 처음부터 다시
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
    } else {
      const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
      setCurrentQuote(randomQuote);
    }
  };

  const refreshFromGitHub = async () => {
    Alert.alert(
      '🔄 GitHub 업데이트',
      '최신 명언을 GitHub에서 다운로드하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '업데이트', 
          onPress: async () => {
            await loadQuotesFromGitHub();
            await checkUpdateStatus();
            Alert.alert('✅ 완료', 'GitHub에서 최신 명언을 가져왔습니다!');
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>
          🌐 GitHub에서 명언 로딩 중...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🎯 현재 명언 */}
        <View style={styles.quoteContainer}>
          <ThemedText style={styles.quoteText}>
            "{currentQuote?.text || '명언을 불러오는 중...'}"
          </ThemedText>
          <ThemedText style={styles.authorText}>
            - {currentQuote?.author || '작자 미상'}
          </ThemedText>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {currentQuote?.category || '일반'}
            </Text>
          </View>
        </View>

        {/* 🎮 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={getNewQuote}
            disabled={quotes.length === 0}
          >
            <Text style={styles.buttonText}>
              ✨ 새로운 명언
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={refreshFromGitHub}
          >
            <Text style={styles.secondaryButtonText}>
              🔄 GitHub 업데이트
            </Text>
          </TouchableOpacity>
        </View>

        {/* 📊 실시간 업데이트 상태 */}
        <View style={styles.statusContainer}>
          <ThemedText style={styles.statusTitle}>
            📊 실시간 업데이트 상태
          </ThemedText>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>📱 총 명언:</Text>
            <Text style={styles.statusValue}>{quotes.length}개</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>🌐 데이터 소스:</Text>
            <Text style={[
              styles.statusValue, 
              updateStatus?.source === 'GitHub' ? styles.githubActive : styles.localActive
            ]}>
              {updateStatus?.source || 'Local'}
            </Text>
          </View>
          
          {updateStatus?.cachedCount > 0 && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>💾 캐시된 명언:</Text>
              <Text style={styles.statusValue}>{updateStatus.cachedCount}개</Text>
            </View>
          )}
          
          {updateStatus?.lastUpdate && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>🕐 마지막 업데이트:</Text>
              <Text style={styles.statusValue}>
                {new Date(updateStatus.lastUpdate).toLocaleString('ko-KR')}
              </Text>
            </View>
          )}
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>🔄 업데이트 필요:</Text>
            <Text style={[
              styles.statusValue,
              updateStatus?.needsUpdate ? styles.needsUpdate : styles.upToDate
            ]}>
              {updateStatus?.needsUpdate ? '예' : '아니오'}
            </Text>
          </View>
        </View>

        {/* 🌟 GitHub 기능 설명 */}
        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoTitle}>
            🌟 GitHub 실시간 업데이트
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • 6시간마다 자동으로 새 명언 확인{'\n'}
            • APK 업데이트 없이 새 명언 추가{'\n'}
            • 오프라인에서도 캐시된 명언 사용{'\n'}
            • 무료 GitHub 호스팅 활용
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    color: '#666',
  },
  quoteContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
    fontWeight: '500',
  },
  authorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statusLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  githubActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  localActive: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  needsUpdate: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  upToDate: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#34495e',
  },
});
