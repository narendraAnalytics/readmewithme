import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TopicCardProps {
  name: string;
  icon: string;
  color: string;
  description: string;
  onPress: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  name,
  icon,
  color,
  description,
  onPress,
}) => {
  return (
    <Animated.View entering={FadeIn.duration(600).springify()}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color + '15' }]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, { backgroundColor: color + '30' }]}>
          <Ionicons name={icon as any} size={32} color={color} />
        </View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    maxWidth: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
