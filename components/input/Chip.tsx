import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Chip = React.memo(function Chip({
  label,
  active,
  onPress,
}: ChipProps) {
  const { colors, spacing, radii, animation } = useAppTheme();
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.94, animation.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, animation.spring.snappy);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        {
          paddingHorizontal: spacing.medium,
          paddingVertical: spacing.tiny + 2,
          borderRadius: radii.capsule,
          backgroundColor: active ? 'rgba(212, 175, 55, 0.12)' : colors.backgroundSecondary,
          borderColor: active ? colors.accentGold : colors.border,
          borderWidth: 1,
        },
        animatedStyle,
      ]}
    >
      <CustomText
        variant="caption"
        weight="600"
        color={active ? colors.accentGold : colors.textSecondary}
      >
        {label}
      </CustomText>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
