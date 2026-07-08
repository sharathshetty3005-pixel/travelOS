import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/theme';
import { useAppStore } from '@/store/appStore';
import { CustomText } from '@/components/typography/CustomText';

export default function SplashScreen() {
  const router = useRouter();
  const { colors, animation } = useAppTheme();
  
  // State read immediately since store is pre-hydrated
  const isOnboardingCompleted = useAppStore((state) => state.isOnboardingCompleted);

  // Animation shared values
  const bgScale = useSharedValue(1.1);
  const contentOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const textTranslateY = useSharedValue(15);

  const bgAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bgScale.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  useEffect(() => {
    // Snappy, hardware-optimized cinematic animations (Total visual duration 1.1s)
    bgScale.value = withTiming(1.0, {
      duration: animation.duration.slow,
      easing: animation.easing.smooth,
    });

    contentOpacity.value = withTiming(1, {
      duration: 500,
      easing: animation.easing.fade,
    });

    logoScale.value = withTiming(1.0, {
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
    });

    textTranslateY.value = withTiming(0, {
      duration: 700,
      easing: animation.easing.smooth,
    });

    // 1.1 seconds redirect timeout
    const timeout = setTimeout(() => {
      if (isOnboardingCompleted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 1100);

    return () => clearTimeout(timeout);
  }, [isOnboardingCompleted]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar style="light" />
      
      {/* Background layer */}
      <Animated.View
        style={[
          styles.backgroundOverlay,
          { backgroundColor: colors.backgroundPrimary },
          bgAnimatedStyle,
        ]}
      />

      {/* Brand vector details container */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <Animated.View
          style={[
            styles.logoContainer,
            { borderColor: colors.accentGold },
            logoAnimatedStyle,
          ]}
        >
          <View style={[styles.logoDot, { backgroundColor: colors.accentGold }]} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <CustomText variant="display" weight="700" color={colors.textPrimary} style={styles.title}>
            Travel<CustomText variant="display" weight="700" color={colors.accentGold}>OS</CustomText>
          </CustomText>
          <CustomText
            variant="caption"
            weight="500"
            color={colors.textSecondary}
            style={styles.tagline}
          >
            THE PREMIUM AI TRAVEL OPERATING SYSTEM
          </CustomText>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    letterSpacing: 2,
  },
  tagline: {
    letterSpacing: 1.5,
    marginTop: 8,
    textAlign: 'center',
  },
});
