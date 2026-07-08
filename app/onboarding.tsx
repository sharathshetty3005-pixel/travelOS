import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { useAppStore } from '@/store/appStore';
import { CustomText } from '@/components/typography/CustomText';
import { Button } from '@/components/input/Button';
import { GlassCard } from '@/components/layout/GlassCard';
import { IMAGES } from '@/constants/imageRegistry';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const ONBOARDING_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'Discover Curated Escapes',
    subtitle: 'AI-POWERED EXPLORATION',
    description: 'Bespoke destinations matched to your unique taste profile. Uncover hidden coastal trails, ancient historic quarters, and boutique luxury stays.',
    imageUrl: IMAGES.onboarding.discover,
  },
  {
    id: 'slide-2',
    title: 'Intelligent Travel Companion',
    subtitle: 'SYSTEM-WIDE INTEGRATION',
    description: 'Real-time flight status tracking, automated smart packing suggestions, and offline map overlays that keep you secure on every adventure.',
    imageUrl: IMAGES.onboarding.companion,
  },
  {
    id: 'slide-3',
    title: 'Preserve the Journey',
    subtitle: 'MEMORIES & EXPENSES LEDGER',
    description: 'Log multi-currency transactions, keep digital travel documents within reach, and write journal entries on a beautiful interactive memory board.',
    imageUrl: IMAGES.onboarding.preserve,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, spacing, radii, animation } = useAppTheme();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  
  const scrollX = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  // Trigger haptic feedback safely from the UI thread to the JS thread
  const triggerHaptic = () => {
    Haptics.selectionAsync().catch(() => {});
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      
      // Calculate current active slide index dynamically
      const nextIndex = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      if (nextIndex !== activeIndex.value) {
        activeIndex.value = nextIndex;
        runOnJS(triggerHaptic)();
      }
    },
  });

  const handleFinish = () => {
    completeOnboarding();
    // Redirect to cinematic authentication route
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Full bleed parallax background slides */}
      <View style={StyleSheet.absoluteFillObject}>
        {ONBOARDING_SLIDES.map((slide, index) => {
          const animatedBgStyle = useAnimatedStyle(() => {
            const opacityValue = interpolate(
              scrollX.value,
              [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              [0, 1, 0],
              Extrapolate.CLAMP
            );

            const translateX = interpolate(
              scrollX.value,
              [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              [-SCREEN_WIDTH * 0.2, 0, SCREEN_WIDTH * 0.2],
              Extrapolate.CLAMP
            );

            return {
              opacity: opacityValue,
              transform: [{ translateX }],
            };
          });

          return (
            <Animated.View
              key={`bg-${slide.id}`}
              style={[StyleSheet.absoluteFillObject, animatedBgStyle]}
            >
              <Image
                source={slide.imageUrl}
                style={styles.backgroundImage}
                contentFit="cover"
                priority="high"
                transition={animation.duration.fast}
              />
              <View style={[styles.gradientOverlay, { backgroundColor: 'rgba(10, 10, 12, 0.45)' }]} />
            </Animated.View>
          );
        })}
      </View>

      {/* Scroll paging container */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={StyleSheet.absoluteFillObject}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Onboarding slides scroll area"
      >
        {ONBOARDING_SLIDES.map((slide, index) => {
          const animatedCardStyle = useAnimatedStyle(() => {
            const translateY = interpolate(
              scrollX.value,
              [
                (index - 0.8) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 0.8) * SCREEN_WIDTH,
              ],
              [40, 0, 40],
              Extrapolate.CLAMP
            );

            const opacityValue = interpolate(
              scrollX.value,
              [
                (index - 0.5) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 0.5) * SCREEN_WIDTH,
              ],
              [0, 1, 0],
              Extrapolate.CLAMP
            );

            return {
              opacity: opacityValue,
              transform: [{ translateY }],
            };
          });

          return (
            <View key={slide.id} style={styles.slideFrame}>
              <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
                <GlassCard style={styles.card}>
                  <CustomText
                    variant="caption"
                    weight="700"
                    color={colors.accentGold}
                    style={styles.subtitle}
                  >
                    {slide.subtitle}
                  </CustomText>
                  
                  <CustomText
                    variant="heading"
                    weight="600"
                    color="#FFFFFF"
                    style={styles.title}
                  >
                    {slide.title}
                  </CustomText>

                  <CustomText
                    variant="body"
                    weight="400"
                    color="rgba(255, 255, 255, 0.75)"
                    style={styles.description}
                  >
                    {slide.description}
                  </CustomText>

                  {index === ONBOARDING_SLIDES.length - 1 ? (
                    <Button
                      label="Begin Journey"
                      onPress={handleFinish}
                      accessibilityHint="Completes onboarding and opens primary dashboard application dashboard"
                      style={styles.ctaButton}
                    />
                  ) : (
                    <View style={styles.helperSpacing} />
                  )}
                </GlassCard>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Stretching Page Dot Indicators */}
      <View style={[styles.indicatorContainer, { bottom: spacing.xxlarge }]}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const widthValue = interpolate(
              scrollX.value,
              [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              [8, 24, 8],
              Extrapolate.CLAMP
            );

            const opacityValue = interpolate(
              scrollX.value,
              [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              [0.4, 1.0, 0.4],
              Extrapolate.CLAMP
            );

            return {
              width: widthValue,
              opacity: opacityValue,
            };
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.indicatorDot,
                { backgroundColor: colors.accentGold, borderRadius: radii.capsule },
                animatedDotStyle,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
  },
  slideFrame: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardWrapper: {
    width: SCREEN_WIDTH - 40,
    marginBottom: 100,
  },
  card: {
    padding: 24,
  },
  subtitle: {
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    width: '100%',
  },
  helperSpacing: {
    height: 12,
  },
  indicatorContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 12,
  },
  indicatorDot: {
    height: 8,
    marginHorizontal: 4,
  },
});
