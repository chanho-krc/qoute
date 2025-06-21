import { StyleSheet, View, Text, Switch, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  // 알림 권한 요청
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('실패', '알림 권한이 필요합니다!');
        return;
      }
      // token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('알림 권한 허용됨');
    } else {
      Alert.alert('실제 기기에서만 알림을 사용할 수 있습니다.');
    }

    return token;
  }

  // 매일 알림 스케줄링
  async function scheduleDailyNotification() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌟 오늘의 명언',
          body: '새로운 명언이 준비되었습니다. 확인해보세요!',
          data: { screen: 'index' },
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });

      Alert.alert('성공', '매일 오전 9시에 명언 알림을 받을 수 있습니다!');
    } catch (error) {
      Alert.alert('오류', '알림을 설정하는데 실패했습니다.');
      console.error(error);
    }
  }

  // 알림 취소
  async function cancelNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert('완료', '알림이 취소되었습니다.');
    } catch (error) {
      Alert.alert('오류', '알림 취소에 실패했습니다.');
      console.error(error);
    }
  }

  // 알림 토글
  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    
    if (value) {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
      }
      await scheduleDailyNotification();
    } else {
      await cancelNotifications();
    }
  };

  // 컴포넌트 마운트 시 알림 상태 확인
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // 현재 스케줄된 알림 확인
    Notifications.getAllScheduledNotificationsAsync().then(notifications => {
      setNotificationsEnabled(notifications.length > 0);
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🔔 알림 설정
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          매일 영감을 주는 명언을 받아보세요
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.settingItem}>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <ThemedText type="defaultSemiBold" style={styles.settingTitle}>
              매일 명언 알림
            </ThemedText>
            <ThemedText style={styles.settingDescription}>
              매일 오전 9시에 새로운 명언을 받아보세요
            </ThemedText>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.infoSection}>
        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
          📱 알림 정보
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • 매일 오전 9시에 알림이 전송됩니다
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • 500개의 다양한 명언 중에서 랜덤으로 선택됩니다
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • 카테고리: 성공, 인생, 도전, 희망, 자기계발
        </ThemedText>
        <ThemedText style={styles.infoText}>
          • 언제든지 알림을 끄고 켤 수 있습니다
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.statusSection}>
        <ThemedText style={styles.statusText}>
          알림 상태: {notificationsEnabled ? '✅ 활성화' : '❌ 비활성화'}
        </ThemedText>
        {Platform.OS === 'ios' && (
          <ThemedText style={styles.iosNote}>
            📝 iOS에서는 설정 > 알림에서 추가로 알림을 허용해야 할 수 있습니다.
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 6,
    lineHeight: 20,
  },
  statusSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iosNote: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});
