import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/clerk-expo';
import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SocialAuthButton from '@/components/SocialAuthButton';
import AuthDivider from '@/components/AuthDivider';

// Custom hook for browser warming
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  // Browser warming
  useWarmUpBrowser();

  // Mobile OAuth hook using useSSO()
  const { startSSOFlow } = useSSO();

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

  // Mobile OAuth handler - manually triggers OAuth flow
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

          // Check if second factor is needed (email verification code)
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

      // Step 3: Handle direct complete (fallback)
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

  return (
    <LinearGradient
      colors={['#FFE5D9', '#FFF8F3']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/public/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your reading journey</Text>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {pendingEmailCode ? (
              <>
                {/* Email Code Verification UI */}
                <Text style={styles.infoText}>
                  We've sent a verification code to {emailAddress}
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    placeholderTextColor="#999"
                    value={emailCode}
                    onChangeText={setEmailCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onVerifyEmailCode}
                  disabled={loading}
                  style={styles.buttonContainer}>
                  <LinearGradient
                    colors={['#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Verify Code</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Back Button */}
                <TouchableOpacity
                  onPress={() => setPendingEmailCode(false)}
                  style={styles.backButton}>
                  <Ionicons name="arrow-back" size={16} color="#8B5CF6" />
                  <Text style={styles.backText}>Back to sign in</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Social Auth Buttons */}
                <SocialAuthButton
                  provider="oauth_google"
                  onPress={() => onOAuthPress('google', setGoogleLoading)}
                  loading={googleLoading}
                  disabled={loading || githubLoading || linkedinLoading}
                />
                <SocialAuthButton
                  provider="oauth_github"
                  onPress={() => onOAuthPress('github', setGithubLoading)}
                  loading={githubLoading}
                  disabled={loading || googleLoading || linkedinLoading}
                />
                <SocialAuthButton
                  provider="oauth_linkedin"
                  onPress={() => onOAuthPress('linkedin', setLinkedinLoading)}
                  loading={linkedinLoading}
                  disabled={loading || googleLoading || githubLoading}
                />

                {/* Divider */}
                <AuthDivider />

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#999"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading && !googleLoading && !githubLoading && !linkedinLoading}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading && !googleLoading && !githubLoading && !linkedinLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Sign In Button - Only show when not pending email code */}
            {!pendingEmailCode && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onSignInPress}
                disabled={loading}
                style={styles.buttonContainer}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Sign In</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Sign Up Link */}
            {!pendingEmailCode && (
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  eyeIcon: {
    padding: 4,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  linkText: {
    fontSize: 15,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  backText: {
    fontSize: 15,
    color: '#8B5CF6',
    fontWeight: '600',
  },
});
