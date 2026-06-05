import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import gu from "../locales/gu.json";

const SUPPORTED = ["en", "hi", "gu"] as const;

export async function bootstrapI18n() {
  let lng = await AsyncStorage.getItem("lang");
  if (!lng) {
    const device = Localization.getLocales()[0]?.languageCode ?? "en";
    lng = (SUPPORTED as readonly string[]).includes(device) ? device : "en";
  }
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: { en: { translation: en }, hi: { translation: hi }, gu: { translation: gu } },
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  }
}

export async function setLanguage(lng: string) {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem("lang", lng);
}

export default i18n;
