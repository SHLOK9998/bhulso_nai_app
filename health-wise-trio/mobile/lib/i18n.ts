import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import gu from '@/locales/gu.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_KEY = 'app_language';

export async function initI18n() {
  const saved = await AsyncStorage.getItem(LANG_KEY);
  await i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, hi: { translation: hi }, gu: { translation: gu } },
    lng: saved ?? 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export async function setLanguage(lang: string) {
  await AsyncStorage.setItem(LANG_KEY, lang);
  await i18n.changeLanguage(lang);
}

export default i18n;
