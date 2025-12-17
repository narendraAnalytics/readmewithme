import { FeaturesCarousel } from '@/components/landing/FeaturesCarousel';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <LinearGradient
        colors={['#FFE5D9', '#FFF8F3']}
        style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/(auth)/sign-in');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#FFE5D9', '#FFF8F3']}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Top Content Wrapper */}
        <View style={styles.topContentWrapper}>
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
                <Text style={styles.buttonText}>
                  {isSignedIn && user?.username
                    ? `Welcome ${user.username}`
                    : 'Get Started'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign-Out Button - Only show when logged in */}
          {isSignedIn && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSignOut}
              style={styles.signOutButtonContainer}>
              <View style={styles.signOutButton}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Get instant answers, explanations, and summaries as you read.
              Transform any text into an interactive learning experience with
              AI-powered comprehension support.
            </Text>
          </View>
        </View>

        {/* Features Section with New Background */}
        <LinearGradient
          colors={['#FFE5D9', '#FFF8F3']}
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

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerContent}>
            <View style={styles.footerLogoContainer}>
              <MaskedView
                maskElement={
                  <Text style={[styles.footerAppName, styles.gradientText]}>
                    ReadWithME
                  </Text>
                }>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientContainer}>
                  <Text style={[styles.footerAppName, { opacity: 0 }]}>
                    ReadWithME
                  </Text>
                </LinearGradient>
              </MaskedView>
              <Text style={styles.footerTagline}>Your personal AI reading companion</Text>
            </View>

            <View style={styles.socialLinks}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => {
                  Linking.openURL('https://www.linkedin.com/in/nk-analytics');
                }}
                activeOpacity={0.7}>
                <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => {
                  Linking.openURL('mailto:narendra.insights@gmail.com');
                }}
                activeOpacity={0.7}>
                <Ionicons name="mail" size={24} color="#EA4335" />
              </TouchableOpacity>
            </View>

            <Text style={styles.copyrightText}>
              © {new Date().getFullYear()} ReadWithME. All rights reserved.
            </Text>
          </View>
        </View>

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
    paddingHorizontal: 0, // Reset horizontal padding to allow full width sections
    paddingVertical: 0,
    paddingBottom: 20, // Add explicit padding to scroll view
  },
  // Wrapper for top content to maintain original padding
  topContentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
    width: '100%',
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
    paddingHorizontal: 24, // ensuring description has padding since global is removed
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
  signOutButtonContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  signOutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  footerContainer: {
    width: '100%',
    paddingBottom: 80, // Increased from 40 to 80 to prevent truncation
    backgroundColor: 'transparent',
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 32,
  },
  footerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  footerLogoContainer: {
    alignItems: 'center',
    gap: 4,
  },
  footerAppName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  footerTagline: {
    fontSize: 12,
    color: '#888',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 4,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
