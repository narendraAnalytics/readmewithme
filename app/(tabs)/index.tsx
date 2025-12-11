import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

// Feature Card Component
const FeatureCard = ({ emoji, title, description, color }: { emoji: string; title: string; description: string; color: string }) => (
  <View style={[styles.featureCard, { backgroundColor: color }]}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

export default function HomeScreen() {
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
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => console.log('Get Started pressed')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Get instant answers, explanations, and summaries as you read.
            Transform any text into an interactive learning experience with
            AI-powered comprehension support.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeader}>Why ReadWithME?</Text>

          <View style={styles.cardsGrid}>
            <FeatureCard
              emoji="⚡"
              title="Instant Answers"
              description="No waiting for explanations"
              color="#E3F2FD"
            />
            <FeatureCard
              emoji="🧠"
              title="Better Understanding"
              description="Grasp complex topics faster"
              color="#F3E5F5"
            />
            <FeatureCard
              emoji="📖"
              title="Interactive Reading"
              description="Turn any text into a lesson"
              color="#E8F5E9"
            />
            <FeatureCard
              emoji="🎓"
              title="Personalized Learning"
              description="AI adapts to your level"
              color="#FFE0E0"
            />
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
  button: {
    backgroundColor: '#48BB78',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuresSection: {
    width: '100%',
    marginTop: 60,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  featureCard: {
    width: '45%',
    minWidth: 120,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
