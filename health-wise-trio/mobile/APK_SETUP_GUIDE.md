# 📱 HealthMate AI - APK Build & Setup Guide

This guide provides step-by-step instructions to build a standalone Android package (`.apk`) for **HealthMate AI** using **Expo Application Services (EAS)**. 

Since local builds require complex configurations of the Android SDK, Gradle, and Java Development Kit (JDK) on Windows, we use **EAS Build**. EAS builds your app on secure, high-performance cloud servers managed by Expo, and outputs a downloadable APK.

---

## 🛠️ Prerequisites

Before you start, make sure you have:
1. **Node.js** installed on your computer.
2. A free **Expo Account**. If you don't have one, sign up at [expo.dev](https://expo.dev/signup).

---

## 🚀 Step 1: Install EAS CLI & Log In

Open your terminal (PowerShell, Command Prompt, or VS Code terminal) and run:

1. **Install the EAS Command Line Interface (CLI) globally**:
   ```bash
   npm install -g eas-cli
   ```

2. **Log in to your Expo account**:
   ```bash
   eas login
   ```
   *Follow the prompts in the terminal to enter your Expo username/email and password.*

---

## 📦 Step 2: Configure the EAS Project

To link this local project with your Expo account, run the initialization command from the `mobile` directory:

1. **Navigate to the mobile directory** (if you aren't already there):
   ```bash
   cd health-wise-trio/mobile
   ```

2. **Initialize the EAS project**:
   ```bash
   eas project:init
   ```
   *EAS will ask you to select or create a project. Choose the option to create/link to your account.*

---

## 🏗️ Step 3: Run the APK Build

We have configured a `preview` profile in your `eas.json` which is optimized for generating testing APKs. To start the build:

Run the custom build script:
```bash
npm run build:apk
```
*(Alternatively, you can run the direct CLI command: `eas build -p android --profile preview`)*

### What happens during the build:
1. **Credentials Management**: EAS will ask if you want to generate a new Keystore or let Expo manage it. **Choose to let Expo generate/manage the keystore** (select `Yes`).
2. **Cloud Bundling**: The CLI will package your project and upload it to Expo's build servers.
3. **Build Status Link**: The terminal will print a **Build Details URL** (e.g., `https://expo.dev/accounts/.../builds/...`). You can click this link to open the Expo dashboard in your browser and watch the build progress in real-time.

---

## 📥 Step 4: Download and Install the APK

Once the build finishes successfully (usually takes 3–8 minutes):

1. **Get the APK**:
   - **QR Code**: The terminal will display a large QR code. Scan this QR code using your Android phone's camera or a QR reader.
   - **Direct Link**: The terminal and the web dashboard will also provide a direct download link. You can open it on your phone or download the `.apk` file to your PC and transfer it to your phone via USB/Google Drive/Email.
   
2. **Install on Android Phone**:
   - Open the downloaded `.apk` file on your phone.
   - **Unknown Sources warning**: Since the app is not from the Google Play Store, Android will display a warning: *"For your security, your phone is not allowed to install unknown apps from this source"*.
   - Tap **Settings** in the dialog, and turn on **"Allow from this source"** (or enable installation from Chrome/Files).
   - Go back and tap **Install**.
   - If **Play Protect** shows a popup warning, tap **"Install anyway"**.

---

## ⚙️ Configuration Notes

- **API Keys**: The Gemini API key and model config are stored securely inside `eas.json` under the `preview` profile env. They will be embedded into the Javascript bundle at compile time automatically.
- **Supabase Backend**: The app connects directly to your Supabase instance using the hardcoded credentials in `lib/supabase.ts`. This ensures database operations (login, onboarding, logging, medicines) work immediately upon installation.
- **Updating the App**: If you make code changes in the future and want to test them in a new APK, simply run `npm run build:apk` again to generate a fresh build.
