import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { FeaturesCarousel } from '@/components/landing/FeaturesCarousel';

export default function HomeScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const [hasAutoRedirected, setHasAutoRedirected] = useState(false);

  // Auto-redirect logged-in users to dashboard (one-time only)
  useEffect(() => {
    if (isLoaded && isSignedIn && !hasAutoRedirected) {
      setHasAutoRedirected(true);
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, hasAutoRedirected]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/(auth)/sign-in');
    }
  };
  return (
    <LinearGradient
      colors={['#FFE5D9', '#FFF8F3']}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero Section with Logo Overlay */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/public/images/landingPage.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Image
            source={require('@/public/images/logo.png')}
            style={styles.logoOverlay}
            resizeMode="contain"
          />
        </View>

        <MaskedView
          maskElement={
            <Text style={[styles.headline, styles.gradientText]}>
              Your AI Reading Companion
            </Text>
          }>
          <LinearGradient
            colors={['#FF6B35', '#F7931E', '#FDC830']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}>
            <Text style={[styles.headline, { opacity: 0 }]}>
              Your AI Reading Companion
            </Text>
          </LinearGradient>
        </MaskedView>

        <Text style={styles.subtitle}>
          Learn faster with your personal AI reading assistant
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGetStarted}
          disabled={!isLoaded}
          style={styles.buttonContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="book-outline" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Get Started</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Get instant answers, explanations, and summaries as you read.
            Transform any text into an interactive learning experience with
            AI-powered comprehension support.
          </Text>
        </View>

        {/* Features Section with New Background */}
        <LinearGradient
          colors={['#F5F3FF', '#FFFFFF']}
          style={styles.featuresSectionBackground}>
          <View style={styles.featuresSection}>
            <MaskedView
              maskElement={
                <Text style={[styles.sectionHeader, styles.gradientText]}>
                  Discover ReadWithME Features
                </Text>
              }>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientContainer}>
                <Text style={[styles.sectionHeader, { opacity: 0 }]}>
                  Discover ReadWithME Features
                </Text>
              </LinearGradient>
            </MaskedView>

            {/* Modern Carousel */}
            <FeaturesCarousel />
          </View>
        </LinearGradient>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  heroContainer: {
    width: 300,
    height: 300,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
  },
  heroImage: {
    width: 300,
    height: 300,
  },
  logoOverlay: {
    width: 120,
    height: 60,
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  gradientText: {
    backgroundColor: 'transparent',
  },
  gradientContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
  },
  descriptionContainer: {
    marginTop: 0,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
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
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresSectionBackground: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 40,
    marginTop: 20,
  },
  featuresSection: {
    width: '100%',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
});
