import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import gu from "@/locales/gu.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    lng: typeof window !== "undefined" ? localStorage.getItem("lang") || "gu" : "gu",
    fallbackLng: "gu",
    interpolation: { escapeValue: false },
  });
}

export const setLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  if (typeof window !== "undefined") localStorage.setItem("lang", lng);
};

export default i18n;
