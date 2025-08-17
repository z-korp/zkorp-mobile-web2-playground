# 📱 Expo + EAS Build & Deploy Workflow

This document explains how to build, test, and release your app using **Expo** and **EAS** with a clean workflow for **development**, **preview**, and **production**.

---

## 🔹 Profiles Overview

- **Development**  
  - Includes Expo Dev Client  
  - For active coding, hot reload, debugging  
  - Loads JS from `expo start`  
  - Distribution: *internal*

- **Preview**  
  - No Dev Client  
  - Bundles JS/assets at build time  
  - Used for internal testers  
  - Distribution: *internal*  
  - Can be updated with **EAS Update**

- **Production**  
  - Store-ready build  
  - Signed for App Store / Play Store  
  - Distribution: *store*  
  - Can also use **EAS Update** for OTA fixes

---

## 🔹 Workflow

### 1. Local Development
Run the app directly on simulators/emulators without EAS cloud build:
```sh
npm run local:ios
npm run local:android
```

### 2. Development Builds (with Dev Client)
Install once on your device, then run `expo start` for fast iteration:
```sh
npm run eas:build:ios:dev
npm run eas:build:android:dev
```
On iOS Simulator:
```sh
npm run eas:build:ios:sim
```

### 3. Preview Builds (for Testers)
Generate a shareable internal build:
```sh
npm run eas:build:ios:preview
npm run eas:build:android:preview
```

Push OTA updates (no rebuild required):
```sh
npm run update:preview
```

### 4. Production Builds (App Store / Play Store)
Create store-ready builds:
```sh
npm run eas:build:ios:prod
npm run eas:build:android:prod
```

Submit:
```sh
npm run eas:submit:ios
npm run eas:submit:android
```

Push OTA fixes:
```sh
npm run update:prod
```

---

## 🔹 package.json (scripts)

```json
{
  "scripts": {
    "start": "expo start",
    "eas:build:ios:dev": "eas build -p ios --profile development",
    "eas:build:android:dev": "eas build -p android --profile development",
    "eas:build:ios:sim": "eas build -p ios --profile development-simulator",
    "eas:build:ios:preview": "eas build -p ios --profile preview",
    "eas:build:android:preview": "eas build -p android --profile preview",
    "eas:build:ios:prod": "eas build -p ios --profile production",
    "eas:build:android:prod": "eas build -p android --profile production",
    "eas:submit:ios": "eas submit -p ios --profile production",
    "eas:submit:android": "eas submit -p android --profile production",
    "local:ios": "expo run:ios",
    "local:android": "expo run:android",
    "update:dev": "eas update --channel dev --message \"dev update\"",
    "update:preview": "eas update --channel preview --message \"preview update\"",
    "update:prod": "eas update --channel production --message \"production update\""
  }
}
```

---

## 🔹 eas.json

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "dev",
      "android": { "buildType": "apk" }
    },
    "development-simulator": {
      "extends": "development",
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": { "buildType": "apk" }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  },
  "update": {
    "url": "https://u.expo.dev",
    "checkAutomatically": "ON_LOAD"
  }
}
```
