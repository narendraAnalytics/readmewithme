import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopicCard } from '@/components/dashboard/TopicCard';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { TOPICS } from '@/constants/dashboard';
import { getBooksByTopic, searchBooks } from '@/services/api';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTopicSelect = async (topicName: string) => {
    setLoading(true);
    setError('');
    setResults('');

    try {
      const response = await getBooksByTopic(topicName);
      setResults(response);
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
      setResults(response);
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
          <Text style={styles.title}>Discover Books</Text>
          <Text style={styles.subtitle}>
            Explore topics or search for any book
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Topic Grid */}
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

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Fetching recommendations...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        {results && !loading && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Recommendations</Text>
            <Text style={styles.resultsText}>{results}</Text>
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
    justifyContent: 'space-between',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
});
