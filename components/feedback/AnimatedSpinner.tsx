import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';

interface AnimatedSpinnerProps {
  size?: number;
  color?: string;
}

export function AnimatedSpinner({ size = 28, color }: AnimatedSpinnerProps) {
  const { colors } = useAppTheme();
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    // Smooth infinite rotation worklet
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1, // Loop infinitely
      false // Do not reverse direction
    );
  }, []);

  return (
    <Animated.View style={animatedStyle} accessibilityRole="image" accessibilityLabel="Loading indicator">
      <Ionicons
        name="sync-outline"
        size={size}
        color={color || colors.accentGold}
      />
    </Animated.View>
  );
}
