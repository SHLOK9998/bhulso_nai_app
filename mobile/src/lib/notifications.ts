import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensurePermission(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (status !== "granted") {
    const { status: req } = await Notifications.requestPermissionsAsync();
    status = req;
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("medicines", {
      name: "Medicine reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0EA5A4",
    });
  }
  return status === "granted";
}

export type MedSchedule = { id: string; name: string; time: string };

export async function clearAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyMedicines(items: MedSchedule[]) {
  await clearAllScheduled();
  for (const it of items) {
    const [h, m] = it.time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "HealthMate AI",
        body: `Time to take ${it.name} (${it.time})`,
        sound: "default",
      },
      trigger: {
        hour: h,
        minute: m,
        repeats: true,
        channelId: "medicines",
      } as Notifications.NotificationTriggerInput,
    });
  }
}
