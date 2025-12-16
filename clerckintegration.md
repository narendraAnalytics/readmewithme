# Clerk Authentication Integration - Complete Guide
## ReadWithMe Expo React Native App

> **Complete documentation of Clerk authentication integration including email/password, OAuth social login, and all issues encountered and resolved.**

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Configuration](#configuration)
5. [Core Implementation](#core-implementation)
6. [Authentication Screens](#authentication-screens)
7. [Authentication Features](#authentication-features)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Authentication Flows](#authentication-flows)
10. [Clerk Dashboard Setup](#clerk-dashboard-setup)
11. [Testing & Deployment](#testing--deployment)
12. [File Reference](#file-reference)
13. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Clerk?

Clerk is a complete authentication and user management solution that provides:
- Pre-built authentication UI components
- Email/password authentication
- OAuth social login (Google, GitHub, LinkedIn, etc.)
- Multi-factor authentication (MFA)
- Session management
- User profile management

### Why Clerk for Expo/React Native?

- **Native support** with `@clerk/clerk-expo` package
- **OAuth deep links** work seamlessly with Expo Dev Client
- **Secure token storage** using Expo's SecureStore
- **Pre-built hooks** for authentication state (`useAuth`, `useUser`, `useSignIn`, etc.)
- **Flexible** - works with custom UI (not just prebuilt components)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ installed
- **Expo CLI** installed (`npm install -g expo-cli`)
- **Expo account** (for development builds)
- **Clerk account** (free tier available)
- **Basic knowledge** of React Native and Expo
- **Android Studio** or **Xcode** (for native builds)

---

## Installation & Setup

### Step 1: Install Required Packages

```bash
npx expo install @clerk/clerk-expo expo-dev-client expo-web-browser expo-secure-store expo-linking
```

**Package Versions (from package.json):**
```json
{
  "@clerk/clerk-expo": "^2.19.11",
  "expo-dev-client": "~6.0.20",
  "expo-web-browser": "~15.0.10",
  "expo-secure-store": "^15.0.8",
  "expo-linking": "~8.0.10"
}
```

### Step 2: Get Clerk Publishable Key

1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### Step 3: Create Environment File

Create `.env` in your project root:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**  Important:** The `EXPO_PUBLIC_` prefix is required for Expo to expose the variable to client code.

---

## Configuration

### App Configuration (app.json)

```json
{
  "expo": {
    "name": "readwithme",
    "slug": "readwithme",
    "scheme": "readwithme",
    "android": {
      "package": "com.saasaideveloper.readwithme"
    },
    "ios": {
      "bundleIdentifier": "com.saasaideveloper.readwithme"
    }
  }
}
```

**Critical Configuration:**
- `"scheme": "readwithme"` - Required for OAuth deep links
- Must match exactly with Clerk Dashboard configuration

### EAS Build Configuration (eas.json)

```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

**Key Settings:**
- `"developmentClient": true` - Enables Expo Dev Client for OAuth support

---

## Core Implementation

### 1. Root Layout Setup

**File:** `app/_layout.tsx`

```typescript
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="oauth-native-callback" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
```

**Key Components:**

1. **WebBrowser.maybeCompleteAuthSession()** (Line 2)
   - Must be called at module level (top of file)
   - Completes OAuth sessions when app receives deep link redirect
   - Critical for OAuth to work on native platforms

2. **ClerkProvider** (Line 26)
   - Wraps entire app to provide authentication context
   - `tokenCache` - Secure token storage using Expo SecureStore
   - `publishableKey` - Clerk API key from environment

3. **ClerkLoaded** (Line 27)
   - Ensures Clerk is initialized before rendering children
   - Prevents auth state from being undefined

4. **Stack Navigation** (Line 29-33)
   - Registers all route screens including `oauth-native-callback`

### 2. Auth Routes Layout

**File:** `app/(auth)/_layout.tsx`

```typescript
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  // If user is already signed in, redirect to home
  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
```

**Purpose:** Protects auth routes - already signed-in users are redirected to home.

---

## Authentication Screens

### Sign-In Screen

**File:** `app/(auth)/sign-in.tsx`

#### Browser Warming Hook

```typescript
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
```

**Purpose:** Pre-loads browser for faster OAuth experience.

#### Component State

```typescript
export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

  useWarmUpBrowser();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmailCode, setPendingEmailCode] = useState(false);
  const [emailCode, setEmailCode] = useState('');

  // OAuth loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
```

#### Email/Password Sign-In Handler

```typescript
const onSignInPress = async () => {
  if (!isLoaded) return;

  // Validation
  if (!emailAddress.trim() || !password.trim()) {
    setError('Please fill in all fields');
    return;
  }

  setLoading(true);
  setError('');

  try {
    // Step 1: Create sign-in attempt with identifier
    const signInAttempt = await signIn.create({
      identifier: emailAddress,
    });

    // Step 2: Handle first factor authentication (password)
    if (signInAttempt.status === 'needs_first_factor') {
      const firstFactor = signInAttempt.supportedFirstFactors?.find(
        (f: any) => f.strategy === 'password'
      );

      if (firstFactor) {
        const result = await signIn.attemptFirstFactor({
          strategy: 'password',
          password,
        });

        // Step 3: Check if second factor is needed (email verification code)
        if (result.status === 'needs_second_factor') {
          const emailFactor = result.supportedSecondFactors?.find(
            (f: any) => f.strategy === 'email_code'
          );

          if (emailFactor) {
            await signIn.prepareSecondFactor({
              strategy: 'email_code',
              emailAddressId: (emailFactor as any).emailAddressId,
            });
            setPendingEmailCode(true);
            setLoading(false);
            return;
          }
        }

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          router.replace('/');
          return;
        }
      }
    }

    // Step 4: Handle direct complete (fallback)
    if (signInAttempt.status === 'complete') {
      await setActive({ session: signInAttempt.createdSessionId });
      router.replace('/');
    } else {
      console.error('Sign-in status:', signInAttempt.status);
      setError('Unable to sign in. Please try again.');
    }
  } catch (err: any) {
    console.error('Sign-in error:', JSON.stringify(err, null, 2));
    setError(err.errors?.[0]?.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};
```

**Authentication Flow:**
1. Create sign-in with email identifier
2. Check for `needs_first_factor` status
3. Attempt password verification
4. Check for `needs_second_factor` status (email code)
5. If second factor needed, prepare and show email code UI
6. If complete, set active session and redirect

#### Email Code Verification Handler

```typescript
const onVerifyEmailCode = async () => {
  if (!isLoaded) return;

  if (!emailCode.trim()) {
    setError('Please enter the verification code');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const result = await signIn.attemptSecondFactor({
      strategy: 'email_code',
      code: emailCode,
    });

    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId });
      router.replace('/');
    } else {
      console.error('Verification status:', result.status);
      setError('Verification incomplete. Please try again.');
    }
  } catch (err: any) {
    console.error('Verification error:', JSON.stringify(err, null, 2));
    setError(err.errors?.[0]?.message || 'Invalid verification code');
  } finally {
    setLoading(false);
  }
};
```

#### OAuth Handler

```typescript
const onOAuthPress = useCallback(async (
  provider: 'google' | 'github' | 'linkedin',
  setLoadingState: (val: boolean) => void
) => {
  setLoadingState(true);
  setError('');

  try {
    // Trigger OAuth flow with redirect URL
    const { createdSessionId, setActive: oauthSetActive, signIn: oauthSignIn, signUp } =
      await startSSOFlow({
        strategy: `oauth_${provider}`,
        redirectUrl: Linking.createURL('/oauth-native-callback', { scheme: 'readwithme' })
      });

    // If session created, set it as active
    if (createdSessionId && oauthSetActive) {
      await oauthSetActive({ session: createdSessionId });
      router.replace('/');
    } else {
      // Handle edge cases
      if (signUp?.verifications?.externalAccount?.status === 'transferable') {
        setError('Email already registered. Please sign in instead.');
      } else {
        setError('Authentication cancelled');
      }
    }
  } catch (err: any) {
    console.error(`${provider} OAuth error:`, JSON.stringify(err, null, 2));

    // Map error codes to user-friendly messages
    const errorCode = err.errors?.[0]?.code;
    const errorMessages: Record<string, string> = {
      'oauth_access_denied': 'Access denied. Please try again.',
      'email_address_already_exists': 'Account exists with this email.',
      'oauth_callback_missing': 'OAuth not configured. Check redirect URL.',
      'session_exists': 'You are already signed in.',
    };

    setError(errorMessages[errorCode] || `Failed to sign in with ${provider}`);
  } finally {
    setLoadingState(false);
  }
}, [startSSOFlow]);
```

**OAuth Flow:**
1. Use `useSSO()` hook (for native mobile)
2. Call `startSSOFlow()` with provider strategy
3. Construct redirect URL with custom scheme
4. Browser opens for OAuth authentication
5. User authenticates with provider
6. Browser redirects to `readwithme://oauth-native-callback`
7. Session is created and activated

#### UI with Conditional Rendering

```typescript
{pendingEmailCode ? (
  <>
    {/* Email Code Verification UI */}
    <Text style={styles.infoText}>
      We've sent a verification code to {emailAddress}
    </Text>

    <View style={styles.inputContainer}>
      <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
      <TextInput
        placeholder="Enter verification code"
        value={emailCode}
        onChangeText={setEmailCode}
        keyboardType="number-pad"
      />
    </View>

    <TouchableOpacity onPress={onVerifyEmailCode} disabled={loading}>
      <Text>Verify Code</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setPendingEmailCode(false)}>
      <Text>Back to sign in</Text>
    </TouchableOpacity>
  </>
) : (
  <>
    {/* Social Auth Buttons */}
    <SocialAuthButton
      provider="oauth_google"
      onPress={() => onOAuthPress('google', setGoogleLoading)}
      loading={googleLoading}
    />
    {/* ... more OAuth buttons ... */}

    {/* Email and Password Inputs */}
    {/* ... */}
  </>
)}
```

### OAuth Callback Handler

**File:** `app/oauth-native-callback.tsx`

```typescript
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

// Ensure OAuth session completes
WebBrowser.maybeCompleteAuthSession();

export default function OAuthNativeCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('OAuth callback mounted. isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

    // If already signed in, redirect to home
    if (isLoaded && isSignedIn) {
      console.log('User signed in, redirecting to home...');
      router.replace('/');
      return;
    }

    // Increase timeout to 30 seconds
    const timeout = setTimeout(() => {
      console.log('OAuth timeout - no sign-in detected after 30 seconds');
      setError(true);
    }, 30000);

    return () => clearTimeout(timeout);
  }, [isLoaded, isSignedIn, router]);

  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle" size={48} color="#DC2626" />
        <Text style={styles.errorText}>Authentication timed out</Text>
        <Text style={styles.errorSubtext}>Please try signing in again</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(auth)/sign-in')}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8B5CF6" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}
```

**Key Features:**
- Waits for Clerk to detect sign-in
- 30-second timeout with error UI
- Auto-redirects to home when `isSignedIn` becomes true
- Provides "Try Again" button on timeout

---

## Authentication Features

### 1. First-Factor Authentication (Password)

```typescript
const result = await signIn.attemptFirstFactor({
  strategy: 'password',
  password,
});
```

**Returns:**
- `status: 'complete'` - Sign-in successful
- `status: 'needs_second_factor'` - Additional verification needed

### 2. Second-Factor Authentication (Email Code)

```typescript
// Prepare verification
await signIn.prepareSecondFactor({
  strategy: 'email_code',
  emailAddressId: factorId,
});

// Verify code
const result = await signIn.attemptSecondFactor({
  strategy: 'email_code',
  code: emailCode,
});
```

**Flow:**
1. `prepareSecondFactor()` sends email with code
2. User receives email and enters code
3. `attemptSecondFactor()` verifies code
4. If valid, status becomes `'complete'`

### 3. OAuth Social Login

**Supported Providers:**
- Google: `oauth_google`
- GitHub: `oauth_github`
- LinkedIn: `oauth_linkedin`

**Implementation:**
```typescript
const { startSSOFlow } = useSSO();

const { createdSessionId, setActive } = await startSSOFlow({
  strategy: 'oauth_google', // or oauth_github, oauth_linkedin
  redirectUrl: Linking.createURL('/oauth-native-callback', { scheme: 'readwithme' })
});

if (createdSessionId && setActive) {
  await setActive({ session: createdSessionId });
  router.replace('/');
}
```

### 4. Session Management

#### Setting Active Session

```typescript
await setActive({ session: sessionId });
```

**Effect:** Activates session and makes user "signed in"

#### Checking Auth State

```typescript
const { isSignedIn, isLoaded } = useAuth();

if (isLoaded && isSignedIn) {
  // User is authenticated
}
```

#### Getting User Data

```typescript
const { user } = useUser();

console.log(user.emailAddresses[0].emailAddress);
console.log(user.firstName);
```

#### Sign-Out

```typescript
const { signOut } = useAuth();

await signOut();
router.replace('/(auth)/sign-in');
```

---

## Common Issues & Solutions

### Issue 1: `needs_second_factor` Status Not Handled

**Symptom:** Sign-in fails with "Sign-in incomplete" error even with correct credentials.

**Cause:** Clerk requires email verification as second factor, but code doesn't handle it.

**Solution:**
```typescript
if (result.status === 'needs_second_factor') {
  const emailFactor = result.supportedSecondFactors?.find(
    (f: any) => f.strategy === 'email_code'
  );

  if (emailFactor) {
    await signIn.prepareSecondFactor({
      strategy: 'email_code',
      emailAddressId: emailFactor.emailAddressId,
    });
    setPendingEmailCode(true); // Show email code UI
    return;
  }
}
```

### Issue 2: OAuth Timeout / Infinite Spinner

**Symptom:** After OAuth authentication, app shows loading spinner forever.

**Cause:** OAuth callback not properly configured or deep link not working.

**Solutions:**

1. **Add WebBrowser.maybeCompleteAuthSession():**
```typescript
// At top of oauth-native-callback.tsx
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();
```

2. **Increase Timeout:**
```typescript
const timeout = setTimeout(() => {
  setError(true);
}, 30000); // 30 seconds instead of 10
```

3. **Verify Scheme:**
- Check `app.json` has `"scheme": "readwithme"`
- Verify Clerk Dashboard redirect URL is exactly: `readwithme://oauth-native-callback`

4. **Use Expo Dev Client (NOT Expo Go):**
```bash
npx expo run:android
npx expo start --dev-client
```

### Issue 3: React Hooks Render Error on Sign-Out

**Symptom:**
```
Render Error
Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```

**Cause:** Hooks called after early returns in component.

**Example of WRONG code:**
```typescript
if (!isLoaded) return <View>...</View>;
if (!isSignedIn) return <Redirect/>;
const animatedStyle = useAnimatedStyle(...); // L Hook after early returns
```

**Solution:**
```typescript
const animatedStyle = useAnimatedStyle(...); //  Hook before early returns
if (!isLoaded) return <View>...</View>;
if (!isSignedIn) return <Redirect/>;
```

**Fixed in:** `app/(tabs)/dashboard.tsx` (line 40-61)

### Issue 4: OAuth Not Working in Expo Go

**Symptom:** OAuth redirects don't work, app doesn't receive callback.

**Cause:** Expo Go doesn't support custom URL schemes on native platforms.

**Solution:** Build and run Expo Dev Client:

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Build for Android
npx expo run:android

# Build for iOS
npx expo run:ios

# Start with dev client
npx expo start --dev-client
```

### Issue 5: Deep Link Not Registered

**Symptom:** OAuth returns to browser instead of app.

**Solution:**

1. **Verify `app.json`:**
```json
{
  "expo": {
    "scheme": "readwithme"
  }
}
```

2. **Rebuild app after changing scheme:**
```bash
npx expo prebuild --clean
npx expo run:android
```

3. **Verify Clerk Dashboard:**
- Go to **Social Connections**
- Select provider (Google/GitHub/LinkedIn)
- Set Redirect URL: `readwithme://oauth-native-callback`

---

## Authentication Flows

### Email/Password Sign-In Flow

```
                                                             
                    User Opens Sign-In Page                  
                           ,                                 
                            
                            ¼
                                       
                   Enter Email/Password 
                           ,            
                            
                            ¼
                                           
              signIn.create({ identifier }) 
                       ,                   
                        
                        ¼
                                               
         Status: needs_first_factor?           
               ,                               
                 YES
                ¼
                                               
 signIn.attemptFirstFactor({ password })      
           ,                                   
            
            ¼
                                               
 Status: needs_second_factor?                  
           ,                                   $
    YES                  NO                   
                                              
           ¼                                   
                                            
   Prepare Email Code                       
          ,                                 
                                              
           ¼                                   
                                            
   Show Code Input UI                       
          ,                                 
                                              
           ¼                                   
                                            
    User Enters Code                        
          ,                                 
                                              
           ¼                                   
                                            
   Attempt 2nd Factor                       
          ,                                 
                                              
           <                                   
            
            ¼
                                               
 Status: complete?                              
       ,                                       
         YES
        ¼
                                               
 setActive({ session: createdSessionId })      
           ,                                   
            
            ¼
                                               
         Redirect to Home (/)                   
                                               
```

### OAuth Sign-In Flow

```
                                                             
                User Clicks OAuth Button                     
              (Google / GitHub / LinkedIn)                   
                           ,                                 
                            
                            ¼
                                               
         startSSOFlow({                        
           strategy: 'oauth_google',           
           redirectUrl: 'readwithme://...'     
         })                                    
                   ,                           
                    
                    ¼
                                               
           Browser Opens OAuth Provider        
           (Google/GitHub/LinkedIn login)      
                   ,                           
                    
                    ¼
                                               
           User Authenticates with Provider    
                   ,                           
                    
                    ¼
                                               
         Provider Redirects to:                
         readwithme://oauth-native-callback    
                   ,                           
                    
                    ¼
                                               
         App Receives Deep Link                
         OAuth Callback Component Mounts       
                   ,                           
                    
                    ¼
                                               
         WebBrowser.maybeCompleteAuthSession() 
         Completes OAuth Flow                  
                   ,                           
                    
                    ¼
                                               
         Clerk Creates Session                 
         isSignedIn becomes true               
                   ,                           
                    
                    ¼
                                               
         useEffect Detects isSignedIn = true   
                   ,                           
                    
                    ¼
                                               
              Redirect to Home (/)             
                                               
```

### Sign-Up with Email Verification Flow

```
                                                             
                   User Opens Sign-Up Page                   
                           ,                                 
                            
                            ¼
                                               
         Enter Username, Email, Password       
                   ,                           
                    
                    ¼
                                               
         signUp.create({                       
           emailAddress, password, username    
         })                                    
                   ,                           
                    
                    ¼
                                               
         signUp.prepareEmailAddressVerification
         ({ strategy: 'email_code' })          
                   ,                           
                    
                    ¼
                                               
         Email Sent with Verification Code    
         Show Code Input UI                   
                   ,                           
                    
                    ¼
                                               
         User Enters Verification Code         
                   ,                           
                    
                    ¼
                                               
         signUp.attemptEmailAddressVerification
         ({ code })                            
                   ,                           
                    
                    ¼
                                               
         Status: complete?                     
               ,                               
                 YES
                ¼
                                               
         setActive({ session: sessionId })     
                   ,                           
                    
                    ¼
                                               
               Redirect to Home (/)            
                                               
```

---

## Clerk Dashboard Setup

### 1. Create Clerk Application

1. Go to [clerk.com](https://clerk.com)
2. Sign up or log in
3. Click "Add application"
4. Name it (e.g., "ReadWithMe")
5. Select authentication options
6. Click "Create application"

### 2. Get API Keys

1. Go to **Settings** ’ **API Keys**
2. Copy **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Add to `.env`:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Configure Email/Password Authentication

1. Go to **User & Authentication** ’ **Email, Phone, Username**
2. Enable **Email address**
3. Toggle **Require email verification**
4. Select verification method: **Email verification code**

### 4. Configure OAuth Providers

#### Google OAuth

1. Go to **User & Authentication** ’ **Social Connections**
2. Click **Google**
3. Enable Google OAuth
4. Add **Redirect URL:**
```
readwithme://oauth-native-callback
```
5. Set up Google OAuth in [Google Cloud Console](https://console.cloud.google.com)
6. Copy **Client ID** and **Client Secret** to Clerk

#### GitHub OAuth

1. Go to **User & Authentication** ’ **Social Connections**
2. Click **GitHub**
3. Enable GitHub OAuth
4. Add **Redirect URL:**
```
readwithme://oauth-native-callback
```
5. Create OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
6. Copy **Client ID** and **Client Secret** to Clerk

#### LinkedIn OAuth

1. Go to **User & Authentication** ’ **Social Connections**
2. Click **LinkedIn**
3. Enable LinkedIn OAuth
4. Add **Redirect URL:**
```
readwithme://oauth-native-callback
```
5. Create App in [LinkedIn Developers](https://www.linkedin.com/developers/apps)
6. Copy **Client ID** and **Client Secret** to Clerk

### 5. Configure Multi-Factor Authentication (Optional)

1. Go to **User & Authentication** ’ **Multi-factor**
2. Enable **Email verification code**
3. Users will receive a code when signing in

---

## Testing & Deployment

### Development Build Setup

#### Android

```bash
# Build and install development client
npx expo run:android

# Start development server
npx expo start --dev-client
```

#### iOS

```bash
# Build and install development client
npx expo run:ios

# Start development server
npx expo start --dev-client
```

### Testing OAuth Locally

1. Build dev client: `npx expo run:android`
2. Install on device/emulator
3. Start dev server: `npx expo start --dev-client`
4. Open "ReadWithMe" app (NOT Expo Go)
5. Test OAuth login with each provider

### Production Build

#### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

#### Local Build

```bash
# Android
npx expo build:android -t apk

# iOS
npx expo build:ios -t archive
```

### Verification Checklist

Before deploying:

- [ ] `expo-dev-client` installed
- [ ] `scheme: "readwithme"` in `app.json`
- [ ] `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`
- [ ] Clerk publishable key is correct
- [ ] OAuth redirect URI matches scheme exactly
- [ ] All OAuth providers configured in Clerk Dashboard
- [ ] `WebBrowser.maybeCompleteAuthSession()` in `_layout.tsx`
- [ ] `ClerkProvider` wraps app with `tokenCache`
- [ ] `ClerkLoaded` ensures initialization
- [ ] Sign-in handles `needs_second_factor`
- [ ] OAuth callback has timeout with error UI
- [ ] Hooks are called before early returns
- [ ] Tested on physical device (not just emulator)
- [ ] OAuth works for all providers
- [ ] Email/password login works
- [ ] Sign-out works without errors

---

## File Reference

### All Modified/Created Files

| File Path | Lines | Purpose |
|-----------|-------|---------|
| `app/_layout.tsx` | 40 | Root layout with ClerkProvider, token cache, WebBrowser init |
| `app/(auth)/_layout.tsx` | 22 | Auth routes layout with redirect protection |
| `app/(auth)/sign-in.tsx` | 535 | Sign-in screen with email/password + OAuth |
| `app/(auth)/sign-up.tsx` | 516 | Sign-up screen with email verification |
| `app/oauth-native-callback.tsx` | 109 | OAuth callback handler with timeout |
| `components/SocialAuthButton.tsx` | 102 | Reusable OAuth button component |
| `components/AuthDivider.tsx` | 32 | Divider between OAuth and email auth |
| `app/(tabs)/dashboard.tsx` | 300+ | Dashboard with hooks fix (line 40-61) |
| `package.json` | 55 | Dependencies configuration |
| `app.json` | 57 | App scheme and package configuration |
| `.env` | 3 | Environment variables |
| `eas.json` | 22 | EAS build configuration |

### Key Code Locations

**ClerkProvider Setup:**
- File: `app/_layout.tsx`
- Lines: 26-37

**OAuth Handler:**
- File: `app/(auth)/sign-in.tsx`
- Lines: 56-101

**Email/Password Sign-In:**
- File: `app/(auth)/sign-in.tsx`
- Lines: 103-172

**Second Factor Handling:**
- File: `app/(auth)/sign-in.tsx`
- Lines: 134-147, 174-204

**OAuth Callback:**
- File: `app/oauth-native-callback.tsx`
- Lines: 15-37

**Hooks Fix:**
- File: `app/(tabs)/dashboard.tsx`
- Lines: 40-61

---

## Troubleshooting

### Error: "OAuth callback missing"

**Cause:** Redirect URL not configured in Clerk Dashboard

**Solution:**
1. Go to Clerk Dashboard
2. Navigate to **Social Connections** ’ Select provider
3. Add redirect URL: `readwithme://oauth-native-callback`
4. Ensure scheme matches `app.json`

### Error: "Sign-in incomplete"

**Cause:** Status is not `'complete'` (might be `'needs_second_factor'`)

**Solution:** Implement second factor handling (see code above)

### OAuth Opens Browser But Never Returns

**Cause:** Custom URL scheme not registered or using Expo Go

**Solution:**
1. Verify `"scheme": "readwithme"` in `app.json`
2. Rebuild app: `npx expo run:android`
3. Use Dev Client, NOT Expo Go

### Infinite Loading on OAuth Callback

**Cause:** `WebBrowser.maybeCompleteAuthSession()` not called

**Solution:** Add to top of `oauth-native-callback.tsx`:
```typescript
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();
```

### React Hooks Error on Sign-Out

**Cause:** Hooks called after early returns

**Solution:** Move all hooks to top of component, before any `if` statements or early returns

### "Missing Publishable Key"

**Cause:** Environment variable not loaded

**Solution:**
1. Check `.env` file exists
2. Verify variable name: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Restart dev server: `npx expo start --dev-client`

---

## Summary

This integration provides:

 **Email/Password Authentication** with proper first/second factor handling
 **OAuth Social Login** (Google, GitHub, LinkedIn) with native deep links
 **Email Verification** for both sign-up and sign-in
 **Secure Session Management** with token caching
 **Error Handling** with user-friendly messages
 **Timeout Protection** for OAuth flows
 **React Hooks Compliance** to avoid render errors

**Key Learnings:**

1. **Always use Expo Dev Client** for OAuth (not Expo Go)
2. **Custom URL schemes must match exactly** across app.json and Clerk
3. **Handle all Clerk status values** (`needs_first_factor`, `needs_second_factor`, `complete`)
4. **Call WebBrowser.maybeCompleteAuthSession()** in multiple locations
5. **Put all hooks before early returns** to avoid React errors
6. **Add timeout handling** to OAuth callback for better UX

---

**Created:** December 2025
**Last Updated:** December 2025
**Author:** ReadWithMe Development Team
**Clerk SDK Version:** 2.19.11
**Expo SDK Version:** 52
