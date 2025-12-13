import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useSharedValue,
} from 'react-native-reanimated';
import { FEATURES, Feature } from '@/constants/features';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width

interface FeatureCardProps {
  feature: Feature;
  index: number;
  animationValue: Animated.SharedValue<number>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  index,
  animationValue
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [index - 1, index, index + 1],
      [0.85, 1, 0.85],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      animationValue.value,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <View style={styles.card}>
        <LinearGradient
          colors={[...feature.gradientColors, '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />

        <View style={styles.cardContent}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={feature.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}>
              <Text style={styles.icon}>{feature.icon}</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>{feature.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{feature.description}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export const FeaturesCarousel: React.FC = () => {
  const progressValue = useSharedValue<number>(0);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={CARD_WIDTH}
        height={320}
        autoPlay={true}
        autoPlayInterval={4000}
        data={FEATURES}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
        }}
        renderItem={({ item, index }) => (
          <FeatureCard
            feature={item}
            index={index}
            animationValue={progressValue}
          />
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {FEATURES.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            animationValue={progressValue}
          />
        ))}
      </View>
    </View>
  );
};

interface PaginationDotProps {
  index: number;
  animationValue: Animated.SharedValue<number>;
}

const PaginationDot: React.FC<PaginationDotProps> = ({
  index,
  animationValue
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];

    const dotWidth = interpolate(
      animationValue.value,
      inputRange,
      [6, 24, 6],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      animationValue.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.dot, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 40,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    opacity: 0.1,
  },
  cardContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
});
