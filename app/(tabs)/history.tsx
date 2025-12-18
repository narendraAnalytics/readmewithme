import React, { useState, useEffect } from 'react';
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
import { router, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { getReadingHistory } from '@/services/db/queries/reading';

interface HistoryItem {
  bookTitle: string;
  bookAuthor: string;
  lastReadAt: Date;
  progressPercentage?: number;
}

export default function HistoryScreen() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

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

  // Load history when user is signed in
  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadHistory();
    }
  }, [isSignedIn, user?.id]);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const history = await getReadingHistory(user!.id, 50);
      setHistoryItems(history as HistoryItem[]);
    } catch (err) {
      setError('Failed to load reading history');
      console.error('Error loading history:', err);
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reading History</Text>
          {historyItems.length > 0 && !loading && (
            <Text style={styles.subtitle}>
              {historyItems.length} {historyItems.length === 1 ? 'book' : 'books'}
            </Text>
          )}
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Loading your history...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* History List or Empty State */}
        {!loading && !error && (
          historyItems.length > 0 ? (
            <View style={styles.historyList}>
              {historyItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyCard}
                  onPress={() =>
                    router.push({
                      pathname: '/reading',
                      params: {
                        title: item.bookTitle,
                        author: item.bookAuthor,
                      },
                    })
                  }
                  activeOpacity={0.7}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="book" size={32} color="#8B5CF6" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.bookTitle}
                    </Text>
                    <Text style={styles.cardAuthor} numberOfLines={1}>
                      {item.bookAuthor}
                    </Text>
                    <Text style={styles.cardDate}>
                      Last read: {new Date(item.lastReadAt).toLocaleDateString()}
                    </Text>
                    {item.progressPercentage !== undefined && item.progressPercentage > 0 && (
                      <Text style={styles.cardProgress}>
                        Progress: {item.progressPercentage}%
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Empty State
            <View style={styles.emptyState}>
              <Ionicons name="library-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Reading History Yet</Text>
              <Text style={styles.emptyText}>
                Start reading books to build your history
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/dashboard')}
                activeOpacity={0.7}>
                <Text style={styles.emptyButtonText}>Browse Books</Text>
              </TouchableOpacity>
            </View>
          )
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
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  historyList: {
    paddingTop: 16,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cardAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardProgress: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
