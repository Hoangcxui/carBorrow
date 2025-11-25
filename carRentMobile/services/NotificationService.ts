import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import ApiService from './ApiService';

// Configure notification behavior only if not in Expo Go
if (!Constants.expoConfig?.extra?.expoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export class NotificationService {
  private expoPushToken: string | null = null;

  async registerForPushNotificationsAsync(): Promise<string | null> {
    // Skip notification setup in Expo Go
    if (Constants.appOwnership === 'expo') {
      console.log('Push notifications not available in Expo Go');
      return null;
    }

    let token = null;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Không thể lấy quyền push notification');
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token?.data || null;
  }

  async sendPushTokenToServer(): Promise<void> {
    if (!this.expoPushToken) {
      this.expoPushToken = await this.registerForPushNotificationsAsync();
    }

    if (this.expoPushToken) {
      try {
        await ApiService.post('/api/notifications/register-token', {
          token: this.expoPushToken,
          platform: Platform.OS,
        });
      } catch (error) {
        console.error('Failed to send push token to server:', error);
      }
    }
  }

  async schedulePushNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: trigger || null,
    });

    return notificationId;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Listen for notifications when app is in foreground
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Listen for notification interactions (when user taps notification)
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Remove listeners
  removeNotificationSubscription(subscription: Notifications.Subscription): void {
    subscription.remove();
  }

  // Get notification history
  async getPresentedNotifications(): Promise<Notifications.Notification[]> {
    return await Notifications.getPresentedNotificationsAsync();
  }

  // Clear all notifications from notification tray
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  // Badge management (iOS)
  async setBadgeCount(count: number): Promise<boolean> {
    return await Notifications.setBadgeCountAsync(count);
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  // Utility methods for booking notifications
  async scheduleBookingReminder(bookingId: string, startDate: Date): Promise<string> {
    const reminderTime = new Date(startDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
    
    return this.schedulePushNotification(
      'Nhắc nhở đặt xe',
      'Bạn có lịch nhận xe vào ngày mai. Hãy chuẩn bị giấy tờ cần thiết!',
      { bookingId, type: 'booking_reminder' },
      { date: reminderTime } as Notifications.NotificationTriggerInput
    );
  }

  async scheduleReturnReminder(bookingId: string, endDate: Date): Promise<string> {
    const reminderTime = new Date(endDate.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    
    return this.schedulePushNotification(
      'Nhắc nhở trả xe',
      'Bạn cần trả xe trong 2 giờ nữa. Vui lòng chuẩn bị!',
      { bookingId, type: 'return_reminder' },
      { date: reminderTime } as Notifications.NotificationTriggerInput
    );
  }
}

export default new NotificationService();