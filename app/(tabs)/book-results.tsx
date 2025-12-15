import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { BookCard } from '@/components/dashboard/BookCard';
import { parseBooks } from '@/services/api';
import { Book } from '@/services/types';

export default function BookResultsScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const params = useLocalSearchParams();
  const topicName = params.topic as string || 'Books';
  const resultsText = params.results as string || '';

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

  // Parse the markdown results into Book objects
  const books = parseBooks(resultsText);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleReadBook = (book: Book) => {
    router.push({
      pathname: '/reading',
      params: {
        title: book.title,
        author: book.author,
        publishedDate: book.publishedDate || '',
        topic: topicName,
        results: resultsText,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToDashboard}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
          <Text style={styles.backText}>Back to Topics</Text>
        </TouchableOpacity>

        <Text style={styles.topicName}>{topicName}</Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={24} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Select a book to read</Text>
        </View>

        {/* Book Cards */}
        {books.length > 0 ? (
          books.map((book, index) => (
            <BookCard
              key={index}
              book={book}
              onPress={handleReadBook}
            />
          ))
        ) : (
          // Empty State
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different topic or searching for something else.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleBackToDashboard}>
              <Text style={styles.emptyButtonText}>Browse Topics</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  topicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FB923C',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
