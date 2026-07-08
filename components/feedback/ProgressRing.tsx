import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showText?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing = React.memo(function ProgressRing({
  percentage,
  size = 60,
  strokeWidth = 5,
  color,
  showText = true,
}: ProgressRingProps) {
  const { colors, animation } = useAppTheme();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = color || colors.accentGold;

  // Shared progress value (0.0 to 1.0)
  const progress = useSharedValue(0);

  useEffect(() => {
    // Smooth spring animation to target percentage
    progress.value = withSpring(Math.max(0, Math.min(100, percentage)) / 100, animation.spring.soft);
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active animated progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          // Rotate SVG circle by -90 degrees so it starts drawing at 12 o'clock position
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showText && (
        <View style={[StyleSheet.absoluteFill, styles.textContainer]}>
          <CustomText variant="caption" weight="600" color={colors.textPrimary}>
            {Math.round(percentage)}%
          </CustomText>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
