import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/theme';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: StyleProp<ViewStyle>;
}

export const GlassCard = React.memo(function GlassCard({
  children,
  intensity = 30,
  style,
}: GlassCardProps) {
  const { colors, radii, isDark } = useAppTheme();

  const containerStyle = {
    borderRadius: radii.l,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden' as const,
  };

  // Glass backdrop color based on dark/light mode
  const glassColorStyle = {
    backgroundColor: colors.cardBg,
  };

  // On Web or other environments, BlurView might not render. We fallback to pure CSS opacity card
  if (Platform.OS === 'web') {
    return (
      <View style={[containerStyle, glassColorStyle, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={isDark ? 'dark' : 'light'}
      style={[containerStyle, glassColorStyle, style]}
    >
      {children}
    </BlurView>
  );
});
