# zkorp-mobile-web2-playground

## Project Overview
React Native app using Expo SDK 53 with Supabase authentication and CRUD functionality. Features a hybrid architecture with public pages and protected authenticated features.

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
- **Backend**: Supabase (auth + database)
- **State Management**: Zustand v5.0.7
- **Forms**: React Hook Form + Zod validation
- **Security**: expo-secure-store, expo-local-authentication

## Supabase Integration

### Authentication Features
- Email/password authentication
- Biometric authentication (when available)
- Session management with secure storage
- Real-time auth state synchronization

### Database Schema
- **notes** table with Row Level Security (RLS)
- User-based data isolation
- Optimistic updates with rollback
- Real-time subscriptions for live sync

### Security Implementation
- AES encryption for session storage
- Expo SecureStore for encryption keys
- Environment variables for API keys
- RLS policies for data protection

### Setup Instructions
1. Follow `SUPABASE_SETUP.md` for complete configuration
2. Copy `.env.example` to `.env` and add your Supabase credentials
3. Run the SQL schema in your Supabase dashboard
4. Configure RLS policies for security

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
```
/app
├── _layout.tsx                 # Root layout with auth initialization
├── (tabs)/                     # Public tabs (accessible without auth)
│   ├── _layout.tsx            # Tab navigation layout
│   ├── index.tsx              # Home screen (public)
│   ├── about.tsx              # About screen (public)
│   ├── notes.tsx              # Notes screen (protected with AuthGuard)
│   └── profile.tsx            # Profile/Login screen (adaptive)
├── (auth)/                     # Authentication screens
│   ├── _layout.tsx            # Auth layout
│   ├── sign-in.tsx            # Sign in form
│   └── sign-up.tsx            # Sign up form
└── (protected)/                # Protected routes (require auth)
    ├── _layout.tsx            # Protected layout with auth check
    ├── (tabs)/                # Protected tabs (if needed)
    └── notes/[id].tsx         # Note detail/edit screen

/lib
└── supabase.ts                # Supabase client configuration

/stores
├── authStore.ts               # Authentication state (Zustand)
├── notesStore.ts              # Notes CRUD state (Zustand)
└── uiStore.ts                 # UI state (modals, toasts, etc.)

/components
├── AuthGuard.tsx              # Authentication protection component
└── Toast.tsx                  # Toast notification system

/assets                        # Images, fonts, and other static assets
.env.example                   # Environment variables template
SUPABASE_SETUP.md             # Supabase configuration guide
```

## Important Notes
- Uses Expo Router for navigation (file-based routing with typed routes enabled)
- New React Native architecture enabled
- Web support configured with Metro bundler and static output

## Development Workflow
1. Run `npm install` to install dependencies
2. Configure Supabase:
   - Follow `SUPABASE_SETUP.md` for complete setup
   - Copy `.env.example` to `.env` and add your credentials
   - Run the SQL schema in Supabase dashboard
3. Configure app identifiers in `app.json` for your project
4. Use `npm start` for Expo Go or `npm run ios`/`npm run android` for simulators
5. Test authentication and CRUD functionality

## Architecture Features
- **Hybrid Access**: Public pages (Home, About) + Protected features (Notes)
- **Smart Navigation**: Dynamic tab labels and badges based on auth state
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Real-time Sync**: Live updates across devices using Supabase subscriptions
- **Secure Storage**: Encrypted session management with device keychain
- **Form Validation**: TypeScript-first validation with Zod schemas
- **Error Handling**: Graceful error boundaries with user-friendly messages

## Best Practices
- Use absolute imports with `@/` prefix when configured
- Leverage Expo's built-in components before adding external libraries
- Test on both iOS and Android regularly
- Use EAS Update for quick fixes without app store review
- Keep native dependencies minimal for easier maintenance