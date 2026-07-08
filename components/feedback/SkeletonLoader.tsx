import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme';

interface SkeletonLoaderProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonLoader({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const { colors } = useAppTheme();
  const opacity = useSharedValue(0.35);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Shimmering breathing loop on UI thread
    opacity.value = withRepeat(
      withTiming(0.70, {
        duration: 800,
        easing: Easing.inOut(Easing.quad),
      }),
      -1, // Loop infinitely
      true // Reverse direction (back and forth)
    );
  }, []);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.backgroundTertiary,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel="Loading skeleton placeholder"
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
