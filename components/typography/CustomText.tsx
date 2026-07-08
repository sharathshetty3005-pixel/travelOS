import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useAppTheme } from '@/theme';

export interface CustomTextProps extends RNTextProps {
  variant?: 'display' | 'heading' | 'title' | 'body' | 'label' | 'caption';
  color?: string;
  weight?: '400' | '500' | '600' | '700';
  style?: StyleProp<TextStyle>;
}

export const CustomText = React.memo(function CustomText({
  children,
  variant = 'body',
  color,
  weight,
  style,
  ...props
}: CustomTextProps) {
  const { typography, colors } = useAppTheme();

  // Pick typographic token based on chosen variant
  const variantStyle = typography[variant];

  // Resolve custom overrides for color and weight
  const resolvedStyle: TextStyle = {
    fontSize: variantStyle.fontSize,
    lineHeight: variantStyle.lineHeight,
    fontWeight: weight || variantStyle.fontWeight,
    color: color || colors.textPrimary,
  };

  return (
    <RNText
      style={[styles.base, resolvedStyle, style]}
      accessibilityRole="text"
      {...props}
    >
      {children}
    </RNText>
  );
});

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System', // Fallback to standard iOS/Android System font
  },
});
