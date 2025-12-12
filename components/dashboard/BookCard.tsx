import { Book } from '@/services/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface BookCardProps {
  book: Book;
  onPress?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <Animated.View entering={FadeIn.duration(600).springify()}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress?.(book)}
        activeOpacity={0.7}
        disabled={!onPress}>

        {/* Book Title */}
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>

        {/* Author and Published Date */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color="#8B5CF6" />
            <Text style={styles.metaText} numberOfLines={1}>
              {book.author}
            </Text>
          </View>

          {book.publishedDate && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#10B981" />
              <Text style={styles.dateText}>{book.publishedDate}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {book.description && (
          <Text style={styles.description} numberOfLines={3}>
            {book.description}
          </Text>
        )}

        {/* Read This Book Button */}
        {onPress && (
          <TouchableOpacity style={styles.button} onPress={() => onPress(book)}>
            <Ionicons name="book-outline" size={16} color="#8B5CF6" />
            <Text style={styles.buttonText}>Read This Book</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 12,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});
