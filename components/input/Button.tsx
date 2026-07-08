import React from 'react';
import { StyleSheet, ActivityIndicator, Pressable, ViewStyle, StyleProp, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  prefixIcon?: React.ReactNode;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = React.memo(function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  prefixIcon,
  accessibilityHint,
  style,
}: ButtonProps) {
  const { colors, spacing, radii, animation, isDark, opacity } = useAppTheme();
  const scale = useSharedValue(1);

  // Tactile spring scaling animation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, animation.spring.snappy);
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1.0, animation.spring.snappy);
    }
  };

  // Determine styles based on variant selection
  const getButtonStyles = (): { bg: string; border: string; text: string } => {
    if (disabled) {
      return {
        bg: colors.backgroundTertiary,
        border: 'transparent',
        text: colors.textSecondary,
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          bg: colors.backgroundSecondary,
          border: colors.border,
          text: colors.textPrimary,
        };
      case 'outline':
        return {
          bg: 'transparent',
          border: colors.accentGold,
          text: colors.accentGold,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          border: 'transparent',
          text: colors.textSecondary,
        };
      case 'primary':
      default:
        return {
          bg: colors.accentGold,
          border: 'transparent',
          text: '#1A1C20',
        };
    }
  };

  const btnStyles = getButtonStyles();

  return (
    <AnimatedPressable
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        {
          backgroundColor: btnStyles.bg,
          borderColor: btnStyles.border,
          borderWidth: variant === 'outline' || variant === 'secondary' ? 1 : 0,
          borderRadius: radii.capsule,
          paddingVertical: spacing.medium,
          paddingHorizontal: spacing.xlarge,
          opacity: disabled ? opacity.disabled : 1.0,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color={btnStyles.text} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {prefixIcon && !loading && (
            <View style={[styles.iconWrapper, { marginRight: spacing.tiny }]}>
              {prefixIcon}
            </View>
          )}
          <CustomText
            variant="label"
            color={btnStyles.text}
            style={styles.label}
          >
            {label}
          </CustomText>
        </View>
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  base: {
    height: 48, // Minimum touch target dimensions
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
