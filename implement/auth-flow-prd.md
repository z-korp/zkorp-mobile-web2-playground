# Expo + Supabase Auth Flow Implementation Plan
**Project**: zkorp-mobile-web2-playground
**Timestamp**: 2025-01-08 22:00:00
**Target**: Implement friction-free authentication with Google, Apple, and Email

## 🎯 Goals
- **Friction-free sign-in/sign-up** - Single unified flow
- **One-tap Google & Apple** - Native OAuth providers
- **Optional email** - Password or magic link
- **Single unified flow** - Same buttons for new and returning users
- **Persisted session** - Silent refresh and secure storage
- **Clean navigation** - Separation between Auth and App stacks

## 📋 Implementation Phases

### Phase 1: Foundation Setup
- [ ] Configure Supabase OAuth providers (Google, Apple)
- [ ] Install required dependencies
- [ ] Setup environment variables
- [ ] Configure deep linking

### Phase 2: Navigation Architecture
- [ ] Create RootStack navigator
- [ ] Implement SplashScreen with session check
- [ ] Build AuthStack (AuthScreen, EmailModal)
- [ ] Build AppStack (existing tabs structure)
- [ ] Add navigation guards

### Phase 3: OAuth Integration
- [ ] Implement Google Sign-In
- [ ] Implement Apple Sign-In
- [ ] Create SocialButton component
- [ ] Setup OAuth callback handling
- [ ] Configure redirect URLs

### Phase 4: Email Authentication
- [ ] Create EmailModal with tabs (Password/Magic Link)
- [ ] Implement password sign-in
- [ ] Implement magic link flow
- [ ] Add sign-up with email
- [ ] Handle forgot password

### Phase 5: Session Management
- [ ] Configure expo-secure-store adapter
- [ ] Implement silent refresh
- [ ] Add global auth state management
- [ ] Handle auth state changes

### Phase 6: UX Polish
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Handle account linking
- [ ] Add biometric authentication
- [ ] Profile completion flow

## 🏗️ Project Structure

```
/app
  /_layout.tsx              # Root with session check
  /(auth)/
    _layout.tsx            # Auth stack
    index.tsx              # Unified AuthScreen
    email-modal.tsx        # Email sign-in modal
  /(tabs)/                 # App stack (existing)
    
/components
  SocialButton.tsx         # Reusable OAuth button
  AuthGuard.tsx           # Navigation guard
  
/stores
  authStore.ts            # Enhanced with OAuth
  
/lib
  supabase.ts             # OAuth configuration
  linking.ts              # Deep link config
```

## 🔄 Navigation Flow

```
RootStack
├─ SplashScreen (session check)
│     ├── session OK → AppStack
│     └── no session → AuthStack
│
├─ AuthStack
│     └─ AuthScreen (unified)
│          ├─ Continue with Apple
│          ├─ Continue with Google
│          └─ Sign in with Email → EmailModal
│
└─ AppStack
      └─ (tabs) [existing structure]
```

## 🔑 Authentication Methods

### 1. Google OAuth
```typescript
// Requirements:
- GOOGLE_CLIENT_ID_IOS
- GOOGLE_CLIENT_ID_ANDROID
- GOOGLE_CLIENT_ID_EXPO
```

### 2. Apple OAuth
```typescript
// Requirements:
- APPLE_APP_ID
- APPLE_TEAM_ID
- APPLE_KEY_ID
- APPLE_PRIVATE_KEY
```

### 3. Email Options
- **Password**: Traditional email/password
- **Magic Link**: Passwordless OTP
- **Sign-up**: With email confirmation

## 🔗 Deep Linking Configuration

```typescript
// Redirect URLs:
- Native: zkorpmobileweb2playground://auth/callback
- Expo Go: https://auth.expo.io/@username/app-slug
- Web: http://localhost:8081/auth/callback
```

## 📱 UI/UX Specifications

### Button Ordering (iOS Guidelines)
1. Sign in with Apple (on iOS)
2. Continue with Google
3. Sign in with Email

### Loading States
- Button loading indicators
- Full-screen loading overlay for OAuth
- Inline loading for email forms

### Error Handling
- Map Supabase errors to user-friendly messages
- Handle account linking conflicts
- Network error recovery

## ✅ Implementation Checklist

### Supabase Configuration
- [ ] Enable Google provider
- [ ] Enable Apple provider
- [ ] Configure redirect URLs
- [ ] Set up email templates

### Dependencies
- [ ] @supabase/supabase-js (existing)
- [ ] expo-auth-session
- [ ] expo-secure-store (existing)
- [ ] expo-apple-authentication
- [ ] @react-native-google-signin/google-signin

### Core Features
- [ ] Splash screen with session check
- [ ] Unified auth screen
- [ ] Google OAuth flow
- [ ] Apple OAuth flow
- [ ] Email modal with tabs
- [ ] Deep link handling
- [ ] Session persistence
- [ ] Silent token refresh

### Edge Cases
- [ ] Account already exists
- [ ] Provider linking
- [ ] Email verification
- [ ] Network failures
- [ ] Token expiration

### Enhancements
- [ ] Biometric authentication (existing)
- [ ] Guest mode
- [ ] Profile completion
- [ ] Analytics integration

## 🚀 Migration Strategy

### From Current Implementation
1. **Keep existing features**:
   - Biometric authentication
   - Secure storage
   - Magic link/OTP flow
   
2. **Enhance with**:
   - OAuth providers
   - Unified auth screen
   - Better navigation flow
   - Account linking

3. **Deprecate**:
   - Separate sign-in/sign-up screens
   - Tab-based auth switching

## 📊 Success Metrics
- Sign-in conversion rate > 80%
- OAuth usage > 60%
- Average time to auth < 10 seconds
- Error rate < 2%

## 🔒 Security Considerations
- PKCE flow for OAuth
- Secure token storage
- Session encryption
- Rate limiting
- CSRF protection

## 📝 Next Steps
1. Configure Supabase OAuth providers
2. Install additional dependencies
3. Implement splash screen
4. Build unified auth screen
5. Test OAuth flows
6. Migrate existing users