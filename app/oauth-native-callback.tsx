import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

// Ensure OAuth session completes
WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth Callback - Handles deep link redirect from OAuth providers
 * Waits for Clerk to complete OAuth, then redirects to home
 */
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
