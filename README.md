# zkorp-mobile-web2-playground

A modern React Native application built with Expo SDK 53, designed for experimenting with web3 authentication and mobile development patterns.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on your device or simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical device

## 📱 Features

- **Expo SDK 53** - Latest Expo features and optimizations
- **File-based routing** - Intuitive navigation with Expo Router
- **TypeScript** - Type-safe development experience
- **New Architecture** - React Native's new rendering system enabled
- **Cross-platform** - iOS, Android, and Web support

## 🛠️ Available Scripts

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
npm run lint       # Run ESLint checks
npm run reset-project  # Reset to blank project template
```

## 📁 Project Structure

```
zkorp-mobile-web2-playground/
├── app/              # Screens and navigation (Expo Router)
├── components/       # Reusable UI components
├── constants/        # App constants and theme
├── hooks/           # Custom React hooks
├── assets/          # Images, fonts, and static files
├── scripts/         # Build and utility scripts
└── app.json         # Expo configuration
```

## 🔧 Configuration

### App Configuration
Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- Splash screen
- App icons
- Build configuration

### Environment Setup
For native development:
- **iOS**: Xcode 15+ and iOS Simulator
- **Android**: Android Studio and Android Emulator
- **Web**: Modern web browser

## 🚢 Building for Production

### Using EAS Build
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform ios/android`

### Local Builds
```bash
# iOS (requires macOS)
npx expo run:ios --configuration Release

# Android
npx expo run:android --variant release
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.