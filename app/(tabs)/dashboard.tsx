import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { router, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { TopicCard } from '@/components/dashboard/TopicCard';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { TOPICS } from '@/constants/dashboard';
import { getBooksByTopic, searchBooks } from '@/services/api';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function DashboardScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Animation for home icon
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // FIXED: Declare animated style BEFORE any early returns to avoid hooks violation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  // Auth check - show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const handleHomePress = () => {
    // Animate on press
    scale.value = withSequence(
      withSpring(0.8, { damping: 2 }),
      withSpring(1, { damping: 2 })
    );
    rotation.value = withSequence(
      withSpring(-15, { damping: 8 }),
      withSpring(15, { damping: 8 }),
      withSpring(0, { damping: 8 })
    );

    // Navigate to home
    setTimeout(() => router.push('/'), 300);
  };

  const handleTopicSelect = async (topicName: string) => {
    setLoading(true);
    setError('');
    setResults('');

    try {
      const response = await getBooksByTopic(topicName);
      // Navigate to book results screen with the data
      router.push({
        pathname: '/book-results',
        params: {
          topic: topicName,
          results: response,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError('');
    setResults('');

    try {
      const response = await searchBooks(query);
      // Navigate to book results screen with the data
      router.push({
        pathname: '/book-results',
        params: {
          topic: query,
          results: response,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to search books. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Discover Books</Text>
              <Text style={styles.subtitle}>
                Welcome back, {user?.firstName || 'Reader'}!
              </Text>
            </View>

            <View style={styles.headerButtons}>
              {/* Animated Home Icon */}
              <AnimatedTouchable
                style={[styles.homeButton, animatedStyle]}
                onPress={handleHomePress}
                activeOpacity={0.7}>
                <Ionicons name="home" size={28} color="#8B5CF6" />
              </AnimatedTouchable>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Topic Grid - Hidden when loading */}
        {!loading && (
          <View style={styles.topicsSection}>
            <Text style={styles.sectionTitle}>Browse by Topic</Text>
            <View style={styles.topicsGrid}>
              {TOPICS.map((topic) => (
                <TopicCard
                  key={topic.id}
                  name={topic.name}
                  icon={topic.icon}
                  color={topic.color}
                  description={topic.description}
                  onPress={() => handleTopicSelect(topic.name)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Loading State - Centered on screen */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Consulting the library...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 16,
  },
  homeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  topicsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});
