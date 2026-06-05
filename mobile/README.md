# HealthMate AI — Mobile (React Native + Expo)

A native iOS/Android version of the web app, sharing the same backend (Supabase) so all your medicines, family members, health logs and account sign in across web and mobile.

## What's inside

- **Expo SDK 51** + **expo-router** (file-based navigation, tab bar)
- **Supabase JS** with `AsyncStorage` session persistence
- **expo-notifications** for local daily medicine reminders (no server needed)
- **i18next** with English / हिंदी / ગુજરાતી (same JSON as the web app)
- **react-native-svg** custom Health Score ring
- Full screen parity: Auth (login / signup / forgot password), Onboarding, Dashboard, Medicines, Family, Health Log (today + history), AI Symptoms, Settings

## Setup

```bash
cd mobile
npm install
cp .env.example .env   # already pre-filled with your project's Supabase keys
npx expo start
```

Then either:

- Scan the QR with the **Expo Go** app on your phone (fastest way to try it), **or**
- Press `a` to open the Android emulator, `i` for iOS simulator, `w` for web preview.

> Local notifications require a real device — they don't fire on simulators / Expo web.

## Building a real installable app

When you're ready to ship to the Play Store / App Store, use EAS Build (free tier):

```bash
npm install -g eas-cli
eas login
eas build --platform android   # APK / AAB
eas build --platform ios       # needs Apple developer account
```

EAS handles signing, native code, and produces an installable binary.

## Project structure

```
mobile/
  app/
    _layout.tsx              Root providers (auth, i18n, status bar)
    index.tsx                Auth redirect gate
    (auth)/
      login, signup, forgot-password
    (app)/
      _layout.tsx            Bottom tabs + onboarding gate
      dashboard, medicines, family, log, symptoms, settings
      onboarding             First-run questionnaire
  src/
    lib/
      supabase.ts            Supabase client (AsyncStorage persistence)
      auth.tsx               Auth context
      i18n.ts                i18next bootstrap (device language)
      healthScore.ts         Same scoring formula as web
      notifications.ts       Local daily notifications via expo-notifications
      theme.ts               Color tokens
    components/
      UI.tsx                 Button, Card, Field
      Input.tsx
      ScoreRing.tsx          SVG progress ring
    locales/
      en.json, hi.json, gu.json   (copied from web — same keys)
```

## How it stays in sync with the web app

- Same Supabase project — sign in with your existing account, see the same medicines / family / logs.
- Same RLS policies (per-user data isolation).
- Same locale keys — translating once updates both apps.
- Health Score formula and bucket logic (morning/afternoon/evening) match the web.

## Notes & next steps

- The AI Symptoms screen calls the published web's `/api/analyze-symptoms` endpoint with the user's Supabase access token. If you change the published URL, update `app/(app)/symptoms.tsx`.
- Notifications are scheduled as **daily repeating** triggers per reminder time. Toggling Reminders OFF in Settings just stops the dashboard from rescheduling them on next refresh — for a hard cancel, also reinstall or clear the app.
- Add app icon + splash images to `mobile/assets/` and reference them in `app.json` before publishing to stores.
