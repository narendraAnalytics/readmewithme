import AuthDivider from '@/components/AuthDivider';
import SocialAuthButton from '@/components/SocialAuthButton';
import { useSignUp, useSSO } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Browser warming for OAuth performance
WebBrowser.maybeCompleteAuthSession();

// Custom hook for browser warming
const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const params = useLocalSearchParams();

  // Browser warming
  useWarmUpBrowser();

  // Mobile OAuth hook using useSSO()
  const { startSSOFlow } = useSSO();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingUsername, setPendingUsername] = useState(false);

  // Check for redirected missing username
  useEffect(() => {
    if (params.missing_username === 'true') {
      console.log('Detected missing_username param from redirect');
      setPendingUsername(true);
    }
  }, [params.missing_username]);

  // SSO loading states
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [githubLoading, setGithubLoading] = React.useState(false);
  const [linkedinLoading, setLinkedinLoading] = React.useState(false);

  // Animated Arrow Logic
  const translateY = useSharedValue(0);
  const scrollY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedArrowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50], // Start fading after 0px, invisible by 50px
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateY.value }],
      opacity,
    };
  });

  // Mobile OAuth handler - manually triggers OAuth flow
  const onOAuthPress = useCallback(async (
    provider: 'google' | 'github' | 'linkedin',
    setLoadingState: (val: boolean) => void
  ) => {
    setLoadingState(true);
    setError('');

    try {
      // Trigger OAuth flow - using the redirectUrl configured in Clerk dashboard
      const result = await startSSOFlow({
        strategy: `oauth_${provider}`,
        redirectUrl: Linking.createURL('/oauth-native-callback', { scheme: 'readwithme' })
      });

      console.log(`${provider} OAuth full result:`, JSON.stringify(result, (key, value) => {
        if (key === 'setActive') return '[Function]';
        return value;
      }, 2));

      const { createdSessionId, setActive: oauthSetActive, signIn, signUp: oauthSignUp } = result;

      console.log(`${provider} Statuses - SignIn: ${signIn?.status}, SignUp: ${oauthSignUp?.status}`);

      // If session created, set it as active
      if (createdSessionId && oauthSetActive) {
        console.log(`Setting active session: ${createdSessionId}`);
        await oauthSetActive({ session: createdSessionId });
        router.replace('/');
      } else {
        // Handle incomplete sign-up or sign-in
        if (oauthSignUp?.status === 'missing_requirements' && oauthSignUp.missingFields.includes('username')) {
          console.log('SignUp missing username, prompting user...');
          setPendingUsername(true);
          return;
        }

        if (oauthSignUp?.status === 'missing_requirements') {
          console.log('SignUp missing requirements:', oauthSignUp.missingFields);
          setError(`Please complete your profile: ${oauthSignUp.missingFields.join(', ')}`);
        } else if (oauthSignUp?.verifications?.externalAccount?.status === 'transferable') {
          setError('Email already registered. Please sign in instead.');
        } else if (signIn?.status === 'needs_second_factor') {
          setError('Two-factor authentication required.');
        } else {
          console.log('OAuth incomplete - no createdSessionId and no obvious requirement');
          setError('Authentication incomplete. Please try again.');
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

      setError(errorMessages[errorCode] || `Failed to sign up with ${provider}`);
    } finally {
      setLoadingState(false);
    }
  }, [startSSOFlow]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Validation
    if (!emailAddress.trim() || !password.trim() || !username.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create the user
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Show verification code input
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.errors?.[0]?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      // If verification was completed, set the session to active and redirect
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status is not complete, check why
        console.error('Sign-up not complete:', JSON.stringify(signUpAttempt, null, 2));
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const onCompleteOAuthSignUp = async () => {
    if (!isLoaded || !signUp || !username.trim()) {
      setError('Please choose a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signUp.update({
        username: username.trim(),
      });

      if (result.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        router.replace('/');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to set username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFE5D9', '#FFF8F3']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBackButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#2c3e50" />
            <Text style={styles.headerBackText}>Back</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">

            {/* Banner Image */}
            <View style={styles.bannerContainer}>
              <Image
                source={require('@/public/images/bannerimage2.png')}
                style={styles.banner}
                resizeMode="contain"
              />
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/public/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {pendingVerification ? 'Verify Email' : pendingUsername ? 'Complete Profile' : 'Create Account'}
              </Text>
              <Text style={styles.subtitle}>
                {pendingVerification
                  ? 'Enter the code sent to your email'
                  : pendingUsername
                    ? 'Choose a unique username to finish signing up'
                    : 'Join ReadWithME to start your journey'}
              </Text>

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {!pendingVerification ? (
                pendingUsername ? (
                  <>
                    {/* Username Entry UI for OAuth */}
                    <View style={styles.inputContainer}>
                      <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Choose a username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!loading}
                      />
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={onCompleteOAuthSignUp}
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
                            <Text style={styles.buttonText}>Complete Sign Up</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setPendingUsername(false)}
                      style={styles.backButton}>
                      <Ionicons name="close-circle-outline" size={16} color="#8B5CF6" />
                      <Text style={styles.backText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Social Auth Buttons (omitted for brevity, keeping same logic) */}
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

                    <AuthDivider />

                    <View style={styles.inputContainer}>
                      <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        editable={!loading && !googleLoading && !githubLoading && !linkedinLoading}
                      />
                    </View>

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

                    <View style={styles.inputContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Password (min. 8 characters)"
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

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={onSignUpPress}
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
                            <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Create Account</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )
              ) : (
                <>
                  {/* Verification Code Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Verification code"
                      placeholderTextColor="#999"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onVerifyPress}
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
                          <Text style={styles.buttonText}>Verify Email</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPendingVerification(false)}
                    style={styles.backButton}>
                    <Ionicons name="arrow-back" size={16} color="#8B5CF6" />
                    <Text style={styles.backText}>Back to sign up</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Sign In Link */}
              {!pendingVerification && !pendingUsername && (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                    <Text style={styles.linkText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.ScrollView>
        </KeyboardAvoidingView>

        {/* Animated Scroll Indicator */}
        {!pendingVerification && !pendingUsername && (
          <Animated.View style={[styles.scrollIndicator, animatedArrowStyle]}>
            <Ionicons name="chevron-down" size={30} color="#8B5CF6" />
          </Animated.View>
        )}
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
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 0,
    zIndex: 10,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8, // compensate for padding
    gap: 4,
  },
  headerBackText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
    marginBottom: 20
  },
  bannerContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#FFE5D9', // Matches gradient start
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: -40, // Overlap the banner
  },
  logoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    padding: 12,
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 50,
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
  scrollIndicator: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
});
