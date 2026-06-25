import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { d as createRouter, b as createRootRouteWithContext, f as useRouter, L as Link, a as ScrollRestoration, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { i as instance } from "../_libs/i18next.mjs";
import { p as Pill } from "../_libs/lucide-react.mjs";
import { i as initReactI18next } from "../_libs/react-i18next.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/use-sync-external-store.mjs";
const appCss = "/assets/styles-JB_xFJUS.css";
const AuthCtx = reactExports.createContext({ user: null, session: null, loading: true });
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCtx.Provider, { value: { user: session?.user ?? null, session, loading }, children });
}
const useAuth = () => reactExports.useContext(AuthCtx);
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const app$2 = { "name": "HealthMate AI", "tagline": "AI-powered health companion that learns your habits." };
const nav$2 = { "dashboard": "Dashboard", "medicines": "Medicines", "log": "Health Log", "history": "History", "family": "Family", "symptoms": "AI Symptoms", "notifications": "Alerts", "settings": "Settings", "logout": "Log out", "login": "Sign in", "signup": "Get Started" };
const landing$2 = { "heroBadge": "Trilingual • Privacy-first • AI-powered", "ctaPrimary": "Get Started — Free", "ctaSecondary": "Learn More", "featuresTitle": "Everything you need to stay on top of your health", "features": { "med": { "title": "Smart medicine reminders", "desc": "Color-coded morning, afternoon and night schedules with one-tap mark-as-taken." }, "ai": { "title": "AI symptom analyzer", "desc": "Describe how you feel in your own language — get safe, contextual guidance." }, "ayur": { "title": "Ayurvedic suggestions", "desc": "Traditional home remedies alongside modern AI insights." }, "score": { "title": "Daily health score", "desc": "Sleep, water, mood and adherence rolled into one number to track." }, "tri": { "title": "Built for India", "desc": "Full English, हिंदी and ગુજરાતી — switch any time." }, "private": { "title": "Your data, yours", "desc": "Health data is private. Never sold, never shared." } } };
const auth$2 = { "loginTitle": "Welcome back", "loginSub": "Sign in to your HealthMate account", "signupTitle": "Create your account", "signupSub": "Start your health journey in minutes", "name": "Full name", "email": "Email", "password": "Password", "showPassword": "Show password", "hidePassword": "Hide password", "language": "Preferred language", "submitLogin": "Sign in", "submitSignup": "Create account", "noAccount": "Don't have an account?", "haveAccount": "Already have an account?", "google": "Continue with Google", "forgotLink": "Forgot password?", "forgotTitle": "Reset your password", "forgotSub": "Enter your email and we'll send you a reset link.", "sendReset": "Send reset link", "resetSent": "Check your email for the reset link.", "backToLogin": "Back to sign in", "resetTitle": "Set a new password", "resetSub": "Choose a strong password you don't use elsewhere.", "resetWaiting": "Verifying your reset link…", "newPassword": "New password", "confirmPassword": "Confirm password", "updatePassword": "Update password", "updatePasswordSub": "Change your account password.", "passwordUpdated": "Password updated", "passwordTooShort": "Password must be at least 6 characters", "passwordMismatch": "Passwords do not match" };
const onboarding$2 = { "title": "Tell us about you", "sub": "We'll personalize your tips and reminders.", "age": "Your age", "gender": "Gender", "male": "Male", "female": "Female", "other": "Prefer not to say", "conditions": "Existing conditions (optional)", "conditionsPh": "diabetes, hypertension, asthma...", "goals": "What's your main goal?", "goalsList": { "fitness": "Stay fit", "weight": "Manage weight", "chronic": "Manage chronic condition", "sleep": "Sleep better", "stress": "Reduce stress" }, "wake": "Usual wake time", "sleep": "Usual bedtime", "finish": "Finish setup", "skip": "Skip for now" };
const dashboard$2 = { "greeting": "Hello, {{name}}", "todayTitle": "Today's plan", "noMeds": "No medicines for today. Add your first one!", "healthScore": "Health Score", "scoreBreakdown": "What's making up your score", "score": { "med": "Medicines taken", "water": "Water intake", "sleep": "Sleep quality", "mood": "Mood logged", "log": "Daily log" }, "bucket": { "morning": "Morning", "afternoon": "Afternoon", "evening": "Evening" }, "bucketEmpty": "Nothing scheduled", "water": "Water intake", "sleep": "Sleep", "glasses": "{{count}} glasses", "hours": "{{count}} hours", "quickAdd": "Quick add", "addMedicine": "Add medicine", "logHealth": "Log today", "askAi": "Ask AI", "weeklyAdherence": "Weekly adherence", "insightsTitle": "Personal AI advice", "insightsLoading": "Reading your recent logs...", "insightsRefresh": "Refresh", "insightsEmpty": "Log a few days of data to unlock personal advice.", "alarmsOn": "Alarms enabled", "alarmsOff": "Enable alarms", "alarmsDisabled": "Alarms disabled", "alarmsBlocked": "Notifications blocked in browser", "undo": "Undo", "offline": "Offline — showing saved data" };
const med$2 = { "title": "Medicines", "add": "Add medicine", "edit": "Edit medicine", "name": "Medicine name", "type": "Type", "duration": "Duration (days)", "durationPh": "e.g. 7", "durationLifetimePh": "leave empty for lifetime", "durationHint": "Leave empty if you take this every day for life.", "lifetime": "Lifetime", "mealTiming": "Take with meal", "meal": { "none": "Anytime", "before_breakfast": "Before breakfast", "after_breakfast": "After breakfast", "before_lunch": "Before lunch", "after_lunch": "After lunch", "before_dinner": "Before dinner", "after_dinner": "After dinner" }, "tags": "When to take", "morning": "Morning", "afternoon": "Afternoon", "night": "Night", "times": "Reminder times (HH:MM)", "color": "Pill color", "notes": "Notes", "save": "Save", "cancel": "Cancel", "delete": "Delete", "taken": "Taken", "missed": "Missed", "pending": "Pending", "skip": "Skip", "noneYet": "No medicines yet. Add one to get started.", "deleteConfirm": "Delete this medicine?", "days": "{{count}} days", "forMember": "For whom?", "self": "Yourself" };
const log$2 = { "title": "Health Log", "today": "Today", "tabToday": "Today", "tabHistory": "History", "mood": "How are you feeling?", "moods": { "1": "Awful", "2": "Low", "3": "Okay", "4": "Good", "5": "Great" }, "symptoms": "Any symptoms?", "symptomsPh": "headache, fatigue, cough...", "water": "Water (glasses)", "sleep": "Sleep (hours)", "save": "Save log", "saved": "Saved!" };
const history$2 = { "title": "Monthly History", "sub": "Browse past logs and export reports.", "month": "Month", "noLogs": "No logs for this month yet.", "export": "Export PDF", "summary": "Monthly summary", "avgMood": "Avg mood", "avgSleep": "Avg sleep", "avgWater": "Avg water", "loggedDays": "Logged days" };
const family$2 = { "title": "Family", "sub": "Track health for everyone in your family.", "add": "Add member", "edit": "Edit member", "name": "Name", "relation": "Relation", "age": "Age", "viewing": "Viewing", "self": "Yourself", "deleteConfirm": "Remove this family member?", "noneYet": "No family members yet. Add one to get started.", "addMedPrompt": "Would you like to add a medicine for {{name}} now?", "addMedYes": "Yes, add medicine", "addMedNo": "Later" };
const symptoms$2 = { "title": "AI Symptom Analyzer", "sub": "Describe your symptoms — answer in any language.", "placeholder": "e.g. I have a headache and didn't sleep well", "send": "Analyze", "thinking": "Analyzing...", "urgency": "Urgency", "low": "Low", "medium": "Medium", "high": "High", "causes": "Possible causes", "suggestions": "Safe self-care", "ayurveda": "Traditional suggestions", "ayurDisclaimer": "Traditional suggestion — not a replacement for medical care.", "disclaimer": "This is not medical advice. Consult a doctor if symptoms persist." };
const settings$2 = { "title": "Settings", "profile": "Profile", "language": "Language", "theme": "Theme", "light": "Light", "dark": "Dark", "save": "Save changes", "logout": "Log out", "saved": "Saved!", "emailReadonly": "Your email address cannot be changed." };
const notifications$2 = { "title": "Notification settings", "sub": "Manage your medicine alarm preferences.", "enable": "Enable browser notifications", "enabled": "Notifications enabled", "blocked": "Blocked in browser", "sound": "Alarm sound", "lead": "Remind me this many minutes before", "test": "Send test notification", "permRequest": "Request permission", "saved": "Preferences saved" };
const common$2 = { "loading": "Loading...", "error": "Something went wrong", "retry": "Retry" };
const en = {
  app: app$2,
  nav: nav$2,
  landing: landing$2,
  auth: auth$2,
  onboarding: onboarding$2,
  dashboard: dashboard$2,
  med: med$2,
  log: log$2,
  history: history$2,
  family: family$2,
  symptoms: symptoms$2,
  settings: settings$2,
  notifications: notifications$2,
  common: common$2
};
const app$1 = { "name": "हेल्थमेट AI", "tagline": "आपकी आदतों को सीखने वाला AI-संचालित स्वास्थ्य साथी।" };
const nav$1 = { "dashboard": "डैशबोर्ड", "medicines": "दवाइयाँ", "log": "स्वास्थ्य लॉग", "history": "इतिहास", "family": "परिवार", "symptoms": "AI लक्षण", "notifications": "सूचनाएं", "settings": "सेटिंग्स", "logout": "लॉग आउट", "login": "साइन इन", "signup": "शुरू करें" };
const landing$1 = { "heroBadge": "त्रिभाषी • गोपनीयता-प्रथम • AI-संचालित", "ctaPrimary": "शुरू करें — मुफ़्त", "ctaSecondary": "और जानें", "featuresTitle": "स्वास्थ्य पर नज़र रखने के लिए सब कुछ", "features": { "med": { "title": "स्मार्ट दवा रिमाइंडर", "desc": "सुबह, दोपहर और रात के लिए रंग-कोडेड शेड्यूल।" }, "ai": { "title": "AI लक्षण विश्लेषक", "desc": "अपनी भाषा में बताएं — सुरक्षित मार्गदर्शन पाएं।" }, "ayur": { "title": "आयुर्वेदिक सुझाव", "desc": "AI के साथ पारंपरिक घरेलू उपचार।" }, "score": { "title": "दैनिक स्वास्थ्य स्कोर", "desc": "नींद, पानी, मूड और दवा का एकीकृत स्कोर।" }, "tri": { "title": "भारत के लिए बनाया गया", "desc": "पूर्ण English, हिंदी और ગુજરાતી।" }, "private": { "title": "आपका डेटा, आपका", "desc": "कभी बेचा या साझा नहीं।" } } };
const auth$1 = { "loginTitle": "वापसी पर स्वागत है", "loginSub": "अपने हेल्थमेट खाते में साइन इन करें", "signupTitle": "अपना खाता बनाएं", "signupSub": "मिनटों में अपनी स्वास्थ्य यात्रा शुरू करें", "name": "पूरा नाम", "email": "ईमेल", "password": "पासवर्ड", "showPassword": "पासवर्ड दिखाएं", "hidePassword": "पासवर्ड छिपाएं", "language": "पसंदीदा भाषा", "submitLogin": "साइन इन", "submitSignup": "खाता बनाएं", "noAccount": "खाता नहीं है?", "haveAccount": "पहले से खाता है?", "google": "Google के साथ जारी रखें", "forgotLink": "पासवर्ड भूल गए?", "forgotTitle": "अपना पासवर्ड रीसेट करें", "forgotSub": "अपना ईमेल दर्ज करें — हम रीसेट लिंक भेजेंगे।", "sendReset": "रीसेट लिंक भेजें", "resetSent": "रीसेट लिंक के लिए अपना ईमेल देखें।", "backToLogin": "साइन इन पर वापस जाएं", "resetTitle": "नया पासवर्ड सेट करें", "resetSub": "एक मज़बूत पासवर्ड चुनें।", "resetWaiting": "रीसेट लिंक सत्यापित कर रहे हैं…", "newPassword": "नया पासवर्ड", "confirmPassword": "पासवर्ड पुष्टि करें", "updatePassword": "पासवर्ड अपडेट करें", "updatePasswordSub": "अपना खाता पासवर्ड बदलें।", "passwordUpdated": "पासवर्ड अपडेट हो गया", "passwordTooShort": "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए", "passwordMismatch": "पासवर्ड मेल नहीं खाते" };
const onboarding$1 = { "title": "हमें अपने बारे में बताएं", "sub": "हम आपकी सलाह और रिमाइंडर वैयक्तिकृत करेंगे।", "age": "आपकी उम्र", "gender": "लिंग", "male": "पुरुष", "female": "महिला", "other": "बताना नहीं चाहते", "conditions": "मौजूदा बीमारियाँ (वैकल्पिक)", "conditionsPh": "मधुमेह, उच्च रक्तचाप, अस्थमा...", "goals": "आपका मुख्य लक्ष्य?", "goalsList": { "fitness": "फिट रहें", "weight": "वजन प्रबंधन", "chronic": "बीमारी प्रबंधन", "sleep": "बेहतर नींद", "stress": "तनाव कम करें" }, "wake": "जागने का समय", "sleep": "सोने का समय", "finish": "सेटअप पूर्ण करें", "skip": "अभी छोड़ें" };
const dashboard$1 = { "greeting": "नमस्ते, {{name}}", "todayTitle": "आज की योजना", "noMeds": "आज के लिए कोई दवा नहीं। पहली जोड़ें!", "healthScore": "स्वास्थ्य स्कोर", "scoreBreakdown": "स्कोर का विवरण", "score": { "med": "दवा का पालन", "water": "पानी", "sleep": "नींद की गुणवत्ता", "mood": "मूड दर्ज", "log": "दैनिक लॉग" }, "bucket": { "morning": "सुबह", "afternoon": "दोपहर", "evening": "शाम" }, "bucketEmpty": "कुछ नहीं", "water": "पानी", "sleep": "नींद", "glasses": "{{count}} गिलास", "hours": "{{count}} घंटे", "quickAdd": "त्वरित जोड़ें", "addMedicine": "दवा जोड़ें", "logHealth": "आज लॉग करें", "askAi": "AI से पूछें", "weeklyAdherence": "साप्ताहिक पालन", "insightsTitle": "व्यक्तिगत AI सलाह", "insightsLoading": "आपके हाल के लॉग पढ़ रहे हैं...", "insightsRefresh": "ताज़ा करें", "insightsEmpty": "व्यक्तिगत सलाह पाने के लिए कुछ दिन डेटा लॉग करें।", "alarmsOn": "अलार्म चालू", "alarmsOff": "अलार्म चालू करें", "alarmsDisabled": "अलार्म बंद", "alarmsBlocked": "ब्राउज़र में सूचनाएं अवरुद्ध हैं", "undo": "पूर्ववत करें", "offline": "ऑफ़लाइन — सहेजा गया डेटा दिख रहा है" };
const med$1 = { "title": "दवाइयाँ", "add": "दवा जोड़ें", "edit": "दवा संपादित करें", "name": "दवा का नाम", "type": "प्रकार", "duration": "अवधि (दिन)", "durationPh": "जैसे 7", "durationLifetimePh": "जीवन भर के लिए खाली छोड़ें", "durationHint": "जीवन भर रोज़ लेनी हो तो खाली छोड़ें।", "lifetime": "जीवन भर", "mealTiming": "भोजन के साथ", "meal": { "none": "कभी भी", "before_breakfast": "नाश्ते से पहले", "after_breakfast": "नाश्ते के बाद", "before_lunch": "दोपहर के भोजन से पहले", "after_lunch": "दोपहर के भोजन के बाद", "before_dinner": "रात के भोजन से पहले", "after_dinner": "रात के भोजन के बाद" }, "tags": "कब लेनी है", "morning": "सुबह", "afternoon": "दोपहर", "night": "रात", "times": "रिमाइंडर समय (HH:MM)", "color": "गोली का रंग", "notes": "नोट्स", "save": "सहेजें", "cancel": "रद्द करें", "delete": "हटाएं", "taken": "ली गई", "missed": "छूट गई", "pending": "लंबित", "skip": "छोड़ें", "noneYet": "अभी कोई दवा नहीं। शुरू करने के लिए जोड़ें।", "deleteConfirm": "यह दवा हटाएं?", "days": "{{count}} दिन", "forMember": "किसके लिए?", "self": "स्वयं" };
const log$1 = { "title": "स्वास्थ्य लॉग", "today": "आज", "tabToday": "आज", "tabHistory": "इतिहास", "mood": "आप कैसा महसूस कर रहे हैं?", "moods": { "1": "बहुत बुरा", "2": "कम", "3": "ठीक", "4": "अच्छा", "5": "बढ़िया" }, "symptoms": "कोई लक्षण?", "symptomsPh": "सिरदर्द, थकान, खांसी...", "water": "पानी (गिलास)", "sleep": "नींद (घंटे)", "save": "लॉग सहेजें", "saved": "सहेजा गया!" };
const history$1 = { "title": "मासिक इतिहास", "sub": "पिछले लॉग देखें और रिपोर्ट निर्यात करें।", "month": "महीना", "noLogs": "इस महीने के लिए कोई लॉग नहीं।", "export": "PDF निर्यात करें", "summary": "मासिक सारांश", "avgMood": "औसत मूड", "avgSleep": "औसत नींद", "avgWater": "औसत पानी", "loggedDays": "लॉग किए गए दिन" };
const family$1 = { "title": "परिवार", "sub": "अपने परिवार के सभी सदस्यों के स्वास्थ्य पर नज़र रखें।", "add": "सदस्य जोड़ें", "edit": "सदस्य संपादित करें", "name": "नाम", "relation": "रिश्ता", "age": "उम्र", "viewing": "देख रहे हैं", "self": "स्वयं", "deleteConfirm": "इस सदस्य को हटाएं?", "noneYet": "अभी कोई सदस्य नहीं। शुरू करने के लिए जोड़ें।", "addMedPrompt": "क्या आप अभी {{name}} के लिए दवा जोड़ना चाहेंगे?", "addMedYes": "हाँ, दवा जोड़ें", "addMedNo": "बाद में" };
const symptoms$1 = { "title": "AI लक्षण विश्लेषक", "sub": "अपने लक्षण बताएं — किसी भी भाषा में।", "placeholder": "जैसे मुझे सिरदर्द है और नींद नहीं आई", "send": "विश्लेषण करें", "thinking": "विश्लेषण हो रहा है...", "urgency": "गंभीरता", "low": "कम", "medium": "मध्यम", "high": "उच्च", "causes": "संभावित कारण", "suggestions": "सुरक्षित स्व-देखभाल", "ayurveda": "पारंपरिक सुझाव", "ayurDisclaimer": "पारंपरिक सुझाव — चिकित्सा देखभाल का विकल्प नहीं।", "disclaimer": "यह चिकित्सा सलाह नहीं है। लक्षण बने रहने पर डॉक्टर से मिलें।" };
const settings$1 = { "title": "सेटिंग्स", "profile": "प्रोफ़ाइल", "language": "भाषा", "theme": "थीम", "light": "हल्का", "dark": "गहरा", "save": "बदलाव सहेजें", "logout": "लॉग आउट", "saved": "सहेजा गया!", "emailReadonly": "आपका ईमेल बदला नहीं जा सकता।" };
const notifications$1 = { "title": "सूचना सेटिंग्स", "sub": "अपनी दवा अलार्म प्राथमिकताएं प्रबंधित करें।", "enable": "ब्राउज़र सूचनाएं सक्षम करें", "enabled": "सूचनाएं सक्षम", "blocked": "ब्राउज़र में अवरुद्ध", "sound": "अलार्म ध्वनि", "lead": "इतने मिनट पहले याद दिलाएं", "test": "परीक्षण सूचना भेजें", "permRequest": "अनुमति मांगें", "saved": "प्राथमिकताएं सहेजी गईं" };
const common$1 = { "loading": "लोड हो रहा है...", "error": "कुछ गलत हुआ", "retry": "पुनः प्रयास" };
const hi = {
  app: app$1,
  nav: nav$1,
  landing: landing$1,
  auth: auth$1,
  onboarding: onboarding$1,
  dashboard: dashboard$1,
  med: med$1,
  log: log$1,
  history: history$1,
  family: family$1,
  symptoms: symptoms$1,
  settings: settings$1,
  notifications: notifications$1,
  common: common$1
};
const app = { "name": "હેલ્થમેટ AI", "tagline": "તમારી આદતો શીખતો AI-સંચાલિત આરોગ્ય સાથી." };
const nav = { "dashboard": "ડેશબોર્ડ", "medicines": "દવાઓ", "log": "આરોગ્ય લોગ", "history": "ઇતિહાસ", "family": "પરિવાર", "symptoms": "AI લક્ષણો", "notifications": "સૂચનાઓ", "settings": "સેટિંગ્સ", "logout": "લોગ આઉટ", "login": "સાઇન ઇન", "signup": "શરૂ કરો" };
const landing = { "heroBadge": "ત્રિભાષી • ગોપનીયતા-પ્રથમ • AI-સંચાલિત", "ctaPrimary": "શરૂ કરો — મફત", "ctaSecondary": "વધુ જાણો", "featuresTitle": "આરોગ્ય પર નજર રાખવા માટે બધું", "features": { "med": { "title": "સ્માર્ટ દવા રિમાઇન્ડર", "desc": "સવાર, બપોર અને રાત્રિ માટે રંગ-કોડેડ શેડ્યૂલ." }, "ai": { "title": "AI લક્ષણ વિશ્લેષક", "desc": "તમારી ભાષામાં કહો — સુરક્ષિત માર્ગદર્શન મેળવો." }, "ayur": { "title": "આયુર્વેદિક સૂચનો", "desc": "AI સાથે પરંપરાગત ઘરગથ્થુ ઉપચાર." }, "score": { "title": "દૈનિક આરોગ્ય સ્કોર", "desc": "ઊંઘ, પાણી, મૂડ અને દવાનો એકીકૃત સ્કોર." }, "tri": { "title": "ભારત માટે બનાવેલ", "desc": "પૂર્ણ English, हिंदी અને ગુજરાતી." }, "private": { "title": "તમારો ડેટા, તમારો", "desc": "ક્યારેય વેચાય કે શેર નહીં." } } };
const auth = { "loginTitle": "પાછા આવવા બદલ આભાર", "loginSub": "તમારા હેલ્થમેટ ખાતામાં સાઇન ઇન કરો", "signupTitle": "તમારું ખાતું બનાવો", "signupSub": "મિનિટોમાં તમારી આરોગ્ય યાત્રા શરૂ કરો", "name": "પૂરું નામ", "email": "ઈમેલ", "password": "પાસવર્ડ", "showPassword": "પાસવર્ડ બતાવો", "hidePassword": "પાસવર્ડ છુપાવો", "language": "પસંદગીની ભાષા", "submitLogin": "સાઇન ઇન", "submitSignup": "ખાતું બનાવો", "noAccount": "ખાતું નથી?", "haveAccount": "પહેલેથી ખાતું છે?", "google": "Google સાથે ચાલુ રાખો", "forgotLink": "પાસવર્ડ ભૂલી ગયા?", "forgotTitle": "તમારો પાસવર્ડ રીસેટ કરો", "forgotSub": "તમારો ઈમેલ દાખલ કરો — અમે રીસેટ લિંક મોકલીશું.", "sendReset": "રીસેટ લિંક મોકલો", "resetSent": "રીસેટ લિંક માટે તમારો ઈમેલ તપાસો.", "backToLogin": "સાઇન ઇન પર પાછા જાઓ", "resetTitle": "નવો પાસવર્ડ સેટ કરો", "resetSub": "મજબૂત પાસવર્ડ પસંદ કરો.", "resetWaiting": "રીસેટ લિંક ચકાસી રહ્યા છીએ…", "newPassword": "નવો પાસવર્ડ", "confirmPassword": "પાસવર્ડ ખાતરી કરો", "updatePassword": "પાસવર્ડ અપડેટ કરો", "updatePasswordSub": "તમારા ખાતાનો પાસવર્ડ બદલો.", "passwordUpdated": "પાસવર્ડ અપડેટ થયો", "passwordTooShort": "પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ", "passwordMismatch": "પાસવર્ડ મેળ ખાતા નથી" };
const onboarding = { "title": "અમને તમારા વિશે કહો", "sub": "અમે તમારી સલાહ અને રિમાઇન્ડર વ્યક્તિગત કરીશું.", "age": "તમારી ઉંમર", "gender": "જાતિ", "male": "પુરુષ", "female": "સ્ત્રી", "other": "કહેવા માંગતા નથી", "conditions": "હાલની બીમારીઓ (વૈકલ્પિક)", "conditionsPh": "ડાયાબિટીસ, હાયપરટેન્શન, અસ્થમા...", "goals": "તમારો મુખ્ય ધ્યેય?", "goalsList": { "fitness": "ફિટ રહો", "weight": "વજન વ્યવસ્થાપન", "chronic": "બીમારી વ્યવસ્થાપન", "sleep": "વધુ સારી ઊંઘ", "stress": "તણાવ ઘટાડો" }, "wake": "જાગવાનો સમય", "sleep": "સૂવાનો સમય", "finish": "સેટઅપ પૂર્ણ કરો", "skip": "હમણાં છોડો" };
const dashboard = { "greeting": "નમસ્તે, {{name}}", "todayTitle": "આજનો પ્લાન", "noMeds": "આજ માટે કોઈ દવા નથી. પ્રથમ ઉમેરો!", "healthScore": "આરોગ્ય સ્કોર", "scoreBreakdown": "સ્કોરનું વિગતવાર", "score": { "med": "દવાનું પાલન", "water": "પાણી", "sleep": "ઊંઘની ગુણવત્તા", "mood": "મૂડ નોંધ્યો", "log": "દૈનિક લોગ" }, "bucket": { "morning": "સવાર", "afternoon": "બપોર", "evening": "સાંજ" }, "bucketEmpty": "કંઈ નહીં", "water": "પાણી", "sleep": "ઊંઘ", "glasses": "{{count}} ગ્લાસ", "hours": "{{count}} કલાક", "quickAdd": "ઝડપથી ઉમેરો", "addMedicine": "દવા ઉમેરો", "logHealth": "આજે લોગ કરો", "askAi": "AI ને પૂછો", "weeklyAdherence": "સાપ્તાહિક અનુપાલન", "insightsTitle": "વ્યક્તિગત AI સલાહ", "insightsLoading": "તમારા તાજેતરના લોગ વાંચી રહ્યા છીએ...", "insightsRefresh": "તાજું કરો", "insightsEmpty": "વ્યક્તિગત સલાહ મેળવવા થોડા દિવસોનો ડેટા લોગ કરો.", "alarmsOn": "અલાર્મ ચાલુ", "alarmsOff": "અલાર્મ ચાલુ કરો", "alarmsDisabled": "અલાર્મ બંધ", "alarmsBlocked": "બ્રાઉઝરમાં સૂચનાઓ અવરોધિત છે", "undo": "પૂર્વવત્ કરો", "offline": "ઑફલાઇન — સાચવેલ ડેટા બતાવી રહ્યું છે" };
const med = { "title": "દવાઓ", "add": "દવા ઉમેરો", "edit": "દવા સંપાદિત કરો", "name": "દવાનું નામ", "type": "પ્રકાર", "duration": "અવધિ (દિવસો)", "durationPh": "દા.ત. 7", "durationLifetimePh": "જીવનભર માટે ખાલી છોડો", "durationHint": "જીવનભર રોજ લેવી હોય તો ખાલી છોડો.", "lifetime": "જીવનભર", "mealTiming": "ભોજન સાથે", "meal": { "none": "ગમે ત્યારે", "before_breakfast": "નાસ્તા પહેલા", "after_breakfast": "નાસ્તા પછી", "before_lunch": "બપોરના ભોજન પહેલા", "after_lunch": "બપોરના ભોજન પછી", "before_dinner": "રાત્રિ ભોજન પહેલા", "after_dinner": "રાત્રિ ભોજન પછી" }, "tags": "ક્યારે લેવી", "morning": "સવાર", "afternoon": "બપોર", "night": "રાત્રિ", "times": "રિમાઇન્ડર સમય (HH:MM)", "color": "ગોળીનો રંગ", "notes": "નોંધો", "save": "સાચવો", "cancel": "રદ કરો", "delete": "કાઢી નાખો", "taken": "લીધી", "missed": "ચૂકી", "pending": "બાકી", "skip": "છોડો", "noneYet": "હજુ સુધી કોઈ દવા નથી. શરૂ કરવા માટે ઉમેરો.", "deleteConfirm": "આ દવા કાઢી નાખવી?", "days": "{{count}} દિવસ", "forMember": "કોના માટે?", "self": "પોતે" };
const log = { "title": "આરોગ્ય લોગ", "today": "આજે", "tabToday": "આજે", "tabHistory": "ઇતિહાસ", "mood": "તમે કેવું અનુભવો છો?", "moods": { "1": "ખરાબ", "2": "નીચું", "3": "ઠીક", "4": "સારું", "5": "ઉત્તમ" }, "symptoms": "કોઈ લક્ષણો?", "symptomsPh": "માથાનો દુખાવો, થાક, ઉધરસ...", "water": "પાણી (ગ્લાસ)", "sleep": "ઊંઘ (કલાક)", "save": "લોગ સાચવો", "saved": "સાચવ્યું!" };
const history = { "title": "માસિક ઇતિહાસ", "sub": "પાછલા લોગ જુઓ અને રિપોર્ટ નિકાસ કરો.", "month": "મહિનો", "noLogs": "આ મહિના માટે કોઈ લોગ નથી.", "export": "PDF નિકાસ કરો", "summary": "માસિક સારાંશ", "avgMood": "સરેરાશ મૂડ", "avgSleep": "સરેરાશ ઊંઘ", "avgWater": "સરેરાશ પાણી", "loggedDays": "લોગ કરેલ દિવસો" };
const family = { "title": "પરિવાર", "sub": "તમારા પરિવારના દરેક માટે આરોગ્ય પર નજર રાખો.", "add": "સભ્ય ઉમેરો", "edit": "સભ્ય સંપાદિત કરો", "name": "નામ", "relation": "સંબંધ", "age": "ઉંમર", "viewing": "જોઈ રહ્યા છો", "self": "પોતે", "deleteConfirm": "આ સભ્યને દૂર કરવા?", "noneYet": "હજુ સુધી કોઈ સભ્ય નથી. શરૂ કરવા માટે ઉમેરો.", "addMedPrompt": "શું તમે હમણાં {{name}} માટે દવા ઉમેરવા માંગો છો?", "addMedYes": "હા, દવા ઉમેરો", "addMedNo": "પછી" };
const symptoms = { "title": "AI લક્ષણ વિશ્લેષક", "sub": "તમારા લક્ષણો કહો — કોઈપણ ભાષામાં.", "placeholder": "દા.ત. મને માથાનો દુખાવો છે અને ઊંઘ આવી નથી", "send": "વિશ્લેષણ કરો", "thinking": "વિશ્લેષણ થઈ રહ્યું છે...", "urgency": "તાકીદ", "low": "ઓછી", "medium": "મધ્યમ", "high": "ઊંચી", "causes": "સંભવિત કારણો", "suggestions": "સુરક્ષિત સ્વ-સંભાળ", "ayurveda": "પરંપરાગત સૂચનો", "ayurDisclaimer": "પરંપરાગત સૂચન — તબીબી સંભાળનો વિકલ્પ નથી.", "disclaimer": "આ તબીબી સલાહ નથી. લક્ષણો ચાલુ રહે તો ડૉક્ટરને મળો." };
const settings = { "title": "સેટિંગ્સ", "profile": "પ્રોફાઇલ", "language": "ભાષા", "theme": "થીમ", "light": "પ્રકાશ", "dark": "ઘેરો", "save": "ફેરફારો સાચવો", "logout": "લોગ આઉટ", "saved": "સાચવ્યું!", "emailReadonly": "તમારો ઈમેલ બદલી શકાતો નથી." };
const notifications = { "title": "સૂચના સેટિંગ્સ", "sub": "તમારી દવા અલાર્મ પસંદગીઓનું સંચાલન કરો.", "enable": "બ્રાઉઝર સૂચનાઓ સક્ષમ કરો", "enabled": "સૂચનાઓ સક્ષમ", "blocked": "બ્રાઉઝરમાં અવરોધિત", "sound": "અલાર્મ અવાજ", "lead": "આટલી મિનિટ પહેલા યાદ અપાવો", "test": "પરીક્ષણ સૂચના મોકલો", "permRequest": "પરવાનગી માંગો", "saved": "પસંદગીઓ સાચવી" };
const common = { "loading": "લોડ થઈ રહ્યું છે...", "error": "કંઈક ખોટું થયું", "retry": "ફરી પ્રયાસ" };
const gu = {
  app,
  nav,
  landing,
  auth,
  onboarding,
  dashboard,
  med,
  log,
  history,
  family,
  symptoms,
  settings,
  notifications,
  common
};
if (!instance.isInitialized) {
  instance.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu }
    },
    lng: typeof window !== "undefined" ? localStorage.getItem("lang") || "gu" : "gu",
    fallbackLng: "gu",
    interpolation: { escapeValue: false }
  });
}
const setLanguage = (lng) => {
  instance.changeLanguage(lng);
  if (typeof window !== "undefined") localStorage.setItem("lang", lng);
};
function GlobalPendingComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-[var(--shadow-glow)] animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-8 w-8 animate-bounce" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-primary animate-pulse", children: "Loading..." })
  ] }) });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90", children: "Go home" })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      router2.invalidate();
      reset();
    }, className: "mt-6 rounded-xl bg-primary px-5 py-2.5 text-primary-foreground", children: "Try again" })
  ] }) });
}
const Route$f = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HealthMate AI — Trilingual AI Health Assistant (English, हिंदी, ગુજરાતી)" },
      { name: "description", content: "Free trilingual AI health companion: smart medicine reminders, daily health logs, AI symptom analyzer with Ayurvedic tips, family mode, and PDF monthly reports." },
      { name: "keywords", content: "AI health app, medicine reminder, symptom checker, Ayurveda, health tracker, Hindi health app, Gujarati health app, family health, HealthMate" },
      { name: "author", content: "HealthMate AI" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0EA5A4" },
      { property: "og:title", content: "HealthMate AI — Your Trilingual AI Health Companion" },
      { property: "og:description", content: "Track medicines, log daily health, get AI symptom analysis with Ayurvedic tips. English, हिंदी, ગુજરાતી." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "HealthMate AI" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:locale:alternate", content: "hi_IN" },
      { property: "og:locale:alternate", content: "gu_IN" },
      { name: "twitter:title", content: "HealthMate AI — Your Trilingual AI Health Companion" },
      { name: "twitter:description", content: "AI-powered, trilingual personal health assistant for India." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/79acc5f4-4044-493f-8ecc-175834ff1417" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/79acc5f4-4044-493f-8ecc-175834ff1417" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://health-wise-trio.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap" }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "HealthMate AI",
          "description": "Trilingual AI health assistant — medicine reminders, symptom analysis, Ayurvedic tips, and family health tracking.",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "inLanguage": ["en", "hi", "gu"],
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "url": "https://health-wise-trio.lovable.app/"
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  pendingComponent: GlobalPendingComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$f.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollRestoration, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] }) });
}
const $$splitComponentImporter$d = () => import("./symptoms-D8KruAzC.mjs");
const Route$e = createFileRoute("/symptoms")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./signup-DEjmemQe.mjs");
const Route$d = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./settings-D6dbG_oC.mjs");
const Route$c = createFileRoute("/settings")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./reset-password-C1NWhN8t.mjs");
const Route$b = createFileRoute("/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./onboarding-CeVxEeN7.mjs");
const Route$a = createFileRoute("/onboarding")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./notifications-Clv1k8qc.mjs");
const Route$9 = createFileRoute("/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./medicines-DA581Ze_.mjs");
const Route$8 = createFileRoute("/medicines")({
  validateSearch: (s) => ({
    memberId: typeof s.memberId === "string" ? s.memberId : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./login-DIQnkEWm.mjs");
const Route$7 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./log-Bkmi_L0K.mjs");
const Route$6 = createFileRoute("/log")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./history-C8jdenjU.mjs");
const Route$5 = createFileRoute("/history")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./forgot-password-DZRiT1LD.mjs");
const Route$4 = createFileRoute("/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./family-C_mrCH6b.mjs");
const Route$3 = createFileRoute("/family")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./dashboard-D7ai4zEm.mjs");
const Route$2 = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DENjqhcv.mjs");
const Route$1 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SYS = `You are HealthMate AI, a careful trilingual (English/Hindi/Gujarati) wellness companion.
You NEVER diagnose. You provide safe, general self-care guidance and clearly flag when professional care is needed.
Detect the user's input language and respond ENTIRELY in that same language (en, hi, or gu).
Return STRICT JSON only — no markdown, no prose around it.

JSON shape:
{
  "language": "en"|"hi"|"gu",
  "summary": string,                 // 1 short sentence rephrasing what the user said
  "causes": string[],                // 2-4 plain possible causes
  "suggestions": string[],           // 2-5 safe self-care actions (rest, hydration, OTC categories)
  "ayurveda": string[],              // 2-4 traditional Indian home remedies (e.g., tulsi tea, haldi milk, ginger, ajwain)
  "urgency": "low"|"medium"|"high"   // high = seek urgent care
}

Rules:
- Never name prescription drugs or doses.
- If symptoms suggest emergency (chest pain, stroke signs, heavy bleeding, breathing trouble), set urgency "high" and tell them to seek immediate care.
- Keep each list item short (max ~12 words).`;
const Route = createFileRoute("/api/analyze-symptoms")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { input } = await request.json();
        if (!input || typeof input !== "string" || input.length > 2e3) {
          return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }
        const geminiKey = process.env.GEMINI_API_KEY;
        const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const lovableKey = process.env.LOVABLE_API_KEY;
        if (geminiKey) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${SYS}

User input: ${input}` }]
                  }
                ],
                generationConfig: {
                  responseMimeType: "application/json"
                }
              })
            });
            if (!res.ok) {
              const errorText = await res.text();
              console.error("Gemini native error:", errorText);
              return new Response(JSON.stringify({ error: "Gemini API service error" }), { status: 500 });
            }
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
            let parsed;
            try {
              parsed = JSON.parse(text);
            } catch {
              parsed = { error: "Bad AI response" };
            }
            return Response.json(parsed);
          } catch (e) {
            console.error("Gemini native exception:", e);
            return new Response(JSON.stringify({ error: e.message || "Failed to contact Gemini API" }), { status: 500 });
          }
        } else if (lovableKey) {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableKey },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: SYS },
                { role: "user", content: input }
              ],
              response_format: { type: "json_object" }
            })
          });
          if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), { status: 429 });
          if (res.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits to continue." }), { status: 402 });
          if (!res.ok) return new Response(JSON.stringify({ error: "AI service error" }), { status: 500 });
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content ?? "{}";
          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = { error: "Bad AI response" };
          }
          return Response.json(parsed);
        } else {
          return new Response(JSON.stringify({ error: "No LLM API key configured. Please configure GEMINI_API_KEY in env." }), { status: 500 });
        }
      }
    }
  }
});
const SymptomsRoute = Route$e.update({
  id: "/symptoms",
  path: "/symptoms",
  getParentRoute: () => Route$f
});
const SignupRoute = Route$d.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$f
});
const SettingsRoute = Route$c.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$f
});
const ResetPasswordRoute = Route$b.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$f
});
const OnboardingRoute = Route$a.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$f
});
const NotificationsRoute = Route$9.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$f
});
const MedicinesRoute = Route$8.update({
  id: "/medicines",
  path: "/medicines",
  getParentRoute: () => Route$f
});
const LoginRoute = Route$7.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$f
});
const LogRoute = Route$6.update({
  id: "/log",
  path: "/log",
  getParentRoute: () => Route$f
});
const HistoryRoute = Route$5.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => Route$f
});
const ForgotPasswordRoute = Route$4.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$f
});
const FamilyRoute = Route$3.update({
  id: "/family",
  path: "/family",
  getParentRoute: () => Route$f
});
const DashboardRoute = Route$2.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$f
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$f
});
const ApiAnalyzeSymptomsRoute = Route.update({
  id: "/api/analyze-symptoms",
  path: "/api/analyze-symptoms",
  getParentRoute: () => Route$f
});
const rootRouteChildren = {
  IndexRoute,
  DashboardRoute,
  FamilyRoute,
  ForgotPasswordRoute,
  HistoryRoute,
  LogRoute,
  LoginRoute,
  MedicinesRoute,
  NotificationsRoute,
  OnboardingRoute,
  ResetPasswordRoute,
  SettingsRoute,
  SignupRoute,
  SymptomsRoute,
  ApiAnalyzeSymptomsRoute
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  setLanguage as s,
  useAuth as u
};
