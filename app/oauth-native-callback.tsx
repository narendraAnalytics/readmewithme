import { useAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Ensure OAuth session completes
WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth Callback - Handles deep link redirect from OAuth providers
 * Waits for Clerk to complete OAuth, then redirects to home
 */
export default function OAuthNativeCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('OAuth callback state:', {
      isLoaded,
      isSignedIn,
      currentPath: router.toString(),
    });

    // If already signed in, redirect to home immediately
    if (isLoaded && isSignedIn) {
      console.log('User signed in, redirecting to home...');
      router.replace('/');
      return;
    }

    // Check for incomplete sign-up requirements
    if (signUpLoaded && signUp?.status === 'missing_requirements') {
      console.log('Detected incomplete sign-up in callback, redirecting back to auth screen...');
      if (signUp.missingFields.includes('username')) {
        // Redirect back to sign-up or sign-in with a parameter to trigger the username prompt
        router.replace('/(auth)/sign-in?missing_username=true');
        return;
      }
    }

    // If loaded but not signed in, we wait.
    // Sometimes there's a small delay between the deep link and Clerk state updating.
    const timeout = setTimeout(() => {
      if (!isSignedIn) {
        console.log('OAuth timeout - no sign-in detected after 30 seconds');
        setError(true);
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [isLoaded, isSignedIn, router]);

  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle" size={48} color="#DC2626" style={styles.errorIcon} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F3',
    paddingHorizontal: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
