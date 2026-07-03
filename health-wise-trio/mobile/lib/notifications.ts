import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Set up the notification handler so notifications show in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let schedulingTimeout: any = null;
let resolveQueue: (() => void)[] = [];

export const scheduleAllMedicineNotifications = async (userId: string) => {
  if (schedulingTimeout) {
    clearTimeout(schedulingTimeout);
  }

  return new Promise<void>((resolve) => {
    resolveQueue.push(resolve);

    schedulingTimeout = setTimeout(async () => {
      schedulingTimeout = null;
      const currentResolves = [...resolveQueue];
      resolveQueue = [];

      try {
        // 1. Setup Android channel for high priority, sound, and heads-up alerts
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('medicine-reminders', {
            name: 'Medicine Reminders',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0EA5A4',
            sound: 'default',
            enableVibrate: true,
          });
        }

        // 2. Cancel all existing notifications
        await Notifications.cancelAllScheduledNotificationsAsync();

        // 3. Check if notifications are disabled in user settings
        const stored = await AsyncStorage.getItem('@settings:notifications_enabled');
        if (stored === 'false') {
          console.log('[Notifications] Disabled in user settings.');
          currentResolves.forEach((res) => res());
          return;
        }

        // 4. Check system notification permissions and request them if not granted
        let { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          const { status: askStatus } = await Notifications.requestPermissionsAsync();
          status = askStatus;
        }
        if (status !== 'granted') {
          console.log('[Notifications] System permission not granted.');
          currentResolves.forEach((res) => res());
          return;
        }

        // 5. Load medicines and family members directly from cache to avoid circular imports
        const medsRes = await AsyncStorage.getItem(`@cache:medicines:${userId}:medicines_list`);
        const membersRes = await AsyncStorage.getItem(`@cache:family_members:${userId}:family_list`);

        const meds = medsRes ? JSON.parse(medsRes) : [];
        const members = membersRes ? JSON.parse(membersRes) : [];

        const activeMeds = meds.filter((m: any) => m.active);
        if (activeMeds.length === 0) {
          console.log('[Notifications] No active medicines in cache to schedule.');
          currentResolves.forEach((res) => res());
          return;
        }

        const membersMap = new Map<string, any>(members.map((m: any) => [m.id, m]));

        // 6. Get user language preference
        const profileRes = await AsyncStorage.getItem(`@cache:profiles:${userId}:profile_data`);
        let language = 'en';
        if (profileRes) {
          try {
            const profile = JSON.parse(profileRes);
            language = profile.language || 'en';
          } catch (e) {}
        }

        console.log(`[Notifications] Scheduling reminders for ${activeMeds.length} active medicines. Language: ${language}`);

        // 7. Schedule recurring notifications
        for (const med of activeMeds) {
          const member = med.member_id ? membersMap.get(med.member_id) : null;
          const personName = member ? member.name : '';

          for (const time of (med.reminder_times ?? [])) {
            const parts = time.split(':');
            if (parts.length !== 2) continue;
            const hour = parseInt(parts[0], 10);
            const minute = parseInt(parts[1], 10);
            if (isNaN(hour) || isNaN(minute)) continue;

            let title = 'Medicine Reminder';
            let body = `Time to take ${med.name}`;
            if (personName) {
              body += ` for ${personName}`;
            }

            if (language === 'hi') {
              title = 'दवा अनुस्मारक';
              body = personName 
                ? `${personName} के लिए ${med.name} लेने का समय हो गया है` 
                : `${med.name} लेने का समय हो गया है`;
            } else if (language === 'gu') {
              title = 'દવા રિમાઇન્ડર';
              body = personName 
                ? `${personName} માટે ${med.name} લેવાનો સમય થઈ ગયો છે` 
                : `${med.name} લેવાનો સમય થઈ ગયો છે`;
            }

            const trigger = Platform.select({
              ios: {
                type: 'calendar',
                hour,
                minute,
                repeats: true,
              },
              android: {
                type: 'daily',
                hour,
                minute,
              },
            }) as any;

            await Notifications.scheduleNotificationAsync({
              content: {
                title,
                body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                ...Platform.select({
                  android: {
                    channelId: 'medicine-reminders',
                  },
                }),
              },
              trigger,
            });
          }
        }
        console.log('[Notifications] Completed scheduling all notifications successfully.');
        currentResolves.forEach((res) => res());
      } catch (err) {
        console.error('[Notifications] Error scheduling notifications:', err);
        currentResolves.forEach((res) => res());
      }
    }, 100);
  });
};
