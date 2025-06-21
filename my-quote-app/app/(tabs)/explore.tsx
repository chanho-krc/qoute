import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Switch, ScrollView, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CrowdsourcingManager } from '@/data/crowdsourcedQuotes';

export default function TabTwoScreen() {
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('성공');
  const [submitterName, setSubmitterName] = useState('');

  const categories = ['성공', '인생', '도전', '희망', '자기계발'];

  const handleSubmitQuote = () => {
    if (!quoteText.trim() || !author.trim() || !submitterName.trim()) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (quoteText.length < 10) {
      Alert.alert('입력 오류', '명언은 최소 10자 이상이어야 합니다.');
      return;
    }

    try {
      const quoteId = CrowdsourcingManager.submitQuote({
        text: quoteText.trim(),
        author: author.trim(),
        category: category,
        submittedBy: submitterName.trim()
      });

      Alert.alert(
        '제출 완료! 🎉',
        '명언이 성공적으로 제출되었습니다. 관리자 검토 후 앱에 반영됩니다.',
        [{ text: '확인', onPress: () => {
          setQuoteText('');
          setAuthor('');
          setSubmitterName('');
        }}]
      );
    } catch (error) {
      Alert.alert('오류', '명언 제출 중 오류가 발생했습니다.');
    }
  };

  const stats = CrowdsourcingManager.getStats();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🤝 명언 제출하기</ThemedText>
        <ThemedText type="subtitle">
          좋은 명언을 알고 계신가요? 다른 사용자들과 공유해보세요!
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.formContainer}>
        <ThemedText style={styles.label}>📝 명언 내용 *</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="명언을 입력해주세요..."
          value={quoteText}
          onChangeText={setQuoteText}
          multiline
          numberOfLines={3}
          maxLength={500}
        />
        <ThemedText style={styles.charCount}>
          {quoteText.length}/500자
        </ThemedText>

        <ThemedText style={styles.label}>👤 작가/인물 *</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="명언의 작가나 인물을 입력해주세요"
          value={author}
          onChangeText={setAuthor}
          maxLength={100}
        />

        <ThemedText style={styles.label}>📂 카테고리 *</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.selectedCategory
              ]}
              onPress={() => setCategory(cat)}
            >
              <ThemedText style={[
                styles.categoryText,
                category === cat && styles.selectedCategoryText
              ]}>
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ThemedText style={styles.label}>✍️ 제출자 이름 *</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="닉네임을 입력해주세요"
          value={submitterName}
          onChangeText={setSubmitterName}
          maxLength={50}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuote}>
          <ThemedText style={styles.submitButtonText}>🚀 명언 제출하기</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle">📊 커뮤니티 통계</ThemedText>
        <ThemedView style={styles.statRow}>
          <ThemedText>⏳ 검토 대기중: {stats.pending}개</ThemedText>
          <ThemedText>✅ 승인된 명언: {stats.approved}개</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statRow}>
          <ThemedText>👍 총 투표수: {stats.totalVotes}개</ThemedText>
          <ThemedText>⚠️ 신고 접수: {stats.totalReports}개</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.guidelinesContainer}>
        <ThemedText type="subtitle">📋 제출 가이드라인</ThemedText>
        <ThemedText style={styles.guideline}>• 실제 인물의 검증된 명언만 제출해주세요</ThemedText>
        <ThemedText style={styles.guideline}>• 욕설이나 부적절한 내용은 금지됩니다</ThemedText>
        <ThemedText style={styles.guideline}>• 저작권을 침해하지 않는 내용만 제출해주세요</ThemedText>
        <ThemedText style={styles.guideline}>• 중복된 명언은 자동으로 필터링됩니다</ThemedText>
        <ThemedText style={styles.guideline}>• 관리자 검토 후 2-3일 내에 반영됩니다</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  categoryContainer: {
    marginVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#e3f2fd',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  guidelinesContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff3cd',
    marginBottom: 30,
  },
  guideline: {
    fontSize: 14,
    marginVertical: 3,
    lineHeight: 20,
  },
});
