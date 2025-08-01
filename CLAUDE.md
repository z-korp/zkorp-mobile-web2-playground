# zkorp-mobile-web2-playground

## Project Overview
React Native app using Expo SDK 53 with planned web3 authentication integration.

## Development Philosophy
- **Keep Things Simple**: Avoid over-engineering. Choose the simplest solution that works effectively.
- **DRY (Don't Repeat Yourself)**: Reuse code through shared components, utilities, and hooks. Extract common patterns.
- **Be Pragmatic**: Focus on delivering value. Write code that is maintainable and readable over clever but complex solutions.
- **Code Quality**: Prioritize readability, maintainability, and testability. Clear code is better than clever code.

## EAS Services Integration
We aim to use as many Expo Application Services (EAS) as possible. Use the Context7 MCP server to retrieve up-to-date documentation for any EAS service.

### Available EAS Services:

#### 1. **EAS Build**
Compile and sign Android/iOS apps with custom native code in the cloud. Manages app signing credentials, provisioning profiles, and certificates automatically.
- Commands: `eas build --platform ios/android --profile development/preview/production`
- Configure in: `eas.json` build profiles

#### 2. **EAS Submit**
Upload apps to Google Play Store or Apple App Store directly from the cloud with one CLI command.
- Commands: `eas submit --platform ios/android --profile production`
- Requires: Service account keys (Android) or App Store Connect API keys (iOS)

#### 3. **EAS Update**
Deploy over-the-air (OTA) updates instantly to fix bugs and push quick changes without app store review.
- Commands: `eas update:configure`, `eas update --branch production`
- Features: Channels, runtime versions, rollbacks

#### 4. **EAS Workflows**
Automate development workflows including builds, tests, submissions, and updates using YAML configuration.
- Commands: `eas workflow:run workflow-name.yml`
- Trigger: Manual, GitHub pushes, or scheduled

#### 5. **EAS Metadata** (Preview)
Manage app store listings including descriptions, screenshots, keywords, and categories.
- Simplifies app store presence management across platforms

#### 6. **EAS Insights** (Preview)
Analytics dashboard for app performance, usage patterns, crash reports, and user engagement metrics.
- Requires: `expo-insights` package installation

#### 7. **EAS Hosting** (Preview)
Deploy Expo Router web apps and API routes with edge functions support.
- Commands: `eas hosting:deploy`
- Supports: SSR, SSG, API routes

### EAS CLI Setup
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS in your project
eas init

# Configure specific services
eas update:configure
eas credentials
```

### Environment Variables
Manage secrets and configuration across environments:
```bash
eas env:create NAME value
eas env:list
eas env:pull
```

## Key Dependencies
- **Expo**: v53.0.20 (managed workflow)
- **React Native**: v0.79.5 with React 19.0.0
- **Navigation**: expo-router v5.1.4 (file-based routing)
- **Build**: Npm package manager
- **TypeScript**: v5.8.3

## Essential Configuration

### 1. Bundle Identifiers
- Scheme: `zkorpmobileweb2playground`
- Update iOS and Android bundle identifiers in `app.json` before building

### 2. Platform Requirements
- New Architecture enabled
- iOS supports tablets
- Android edge-to-edge enabled

## Commands
```bash
npm install      # Install dependencies
npm start        # Start Expo Go dev server
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run web      # Run in web browser
npm run lint     # Run ESLint
npm run reset-project  # Reset to blank project
```

## Project Structure
- `/app` - Expo Router screens (file-based routing)
- `/components` - Reusable components
- `/hooks` - Custom React hooks
- `/constants` - App constants (Colors.ts)
- `/assets` - Images, fonts, and other static assets
- `app.json` - Expo configuration
- `eas.json` - EAS Build/Submit configuration (create when needed)

## Important Notes
- Uses Expo Router for navigation (file-based routing with typed routes enabled)
- New React Native architecture enabled
- Web support configured with Metro bundler and static output

## Development Workflow
1. Run `npm install` to install dependencies
2. Configure app identifiers in `app.json` for your project
3. Use `npm start` for Expo Go or `npm run ios`/`npm run android` for simulators
4. For web3 integration, install and configure authentication provider

## Best Practices
- Use absolute imports with `@/` prefix when configured
- Leverage Expo's built-in components before adding external libraries
- Test on both iOS and Android regularly
- Use EAS Update for quick fixes without app store review
- Keep native dependencies minimal for easier maintenance