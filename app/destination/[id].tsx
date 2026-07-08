import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';
import { SkeletonLoader } from '@/components/feedback/SkeletonLoader';

// Destination Domain Component Imports
import { DestinationHeader, HERO_HEIGHT } from '@/features/destination/components/DestinationHeader';
import { StorySection } from '@/features/destination/components/StorySection';
import { HighlightsCarousel } from '@/features/destination/components/HighlightsCarousel';
import { WeatherBudgetCard } from '@/features/destination/components/WeatherBudgetCard';
import { GallerySection } from '@/features/destination/components/GallerySection';
import { MapReviewsSection } from '@/features/destination/components/MapReviewsSection';
import { StickyBottomBar } from '@/features/destination/components/StickyBottomBar';

// Repository Imports
import { destinationRepository } from '@/repositories/DestinationRepository';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NAVBAR_HEIGHT = 56;

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radii, shadow, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<DestinationEntity | null>(null);

  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Query destination details by ID
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const details = await destinationRepository.getDestinationDetails(id);
        setDestination(details);
      } catch (err) {
        // Silenced for mock simulation
      } finally {
        // Keep skeleton loader active for 600ms to showcase shimmering staggers
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    }
    fetchDetails();
  }, [id]);

  // Floating collapsed navigation bar style
  const animatedNavbarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [HERO_HEIGHT - NAVBAR_HEIGHT - 60, HERO_HEIGHT - NAVBAR_HEIGHT - 10],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  // 1. Fallback Loading view
  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.backgroundPrimary }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.skeletonContainer}>
          <SkeletonLoader width="100%" height={HERO_HEIGHT} borderRadius={0} />
          <View style={[styles.skeletonInner, { paddingHorizontal: spacing.xlarge, gap: spacing.large }]}>
            <SkeletonLoader width="60%" height={28} borderRadius={6} />
            <SkeletonLoader width="100%" height={80} borderRadius={10} />
            <SkeletonLoader width="100%" height={120} borderRadius={16} />
          </View>
        </View>
      </View>
    );
  }

  // 2. Fallback Error Recovery view
  if (!destination) {
    return (
      <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <GlassCard style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.error} />
          <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.errorTitle}>
            Destination Not Found
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.errorSubtitle}>
            The destination you requested could not be resolved. It may have been archived or deleted.
          </CustomText>
          <Pressable
            onPress={handleBack}
            style={[styles.errorBtn, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}
          >
            <CustomText variant="caption" weight="700" color="#000000">
              GO BACK
            </CustomText>
          </Pressable>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* 1. Floating Collapsible Navigation Bar */}
      <Animated.View
        style={[
          styles.navbar,
          {
            top: insets.top,
            height: NAVBAR_HEIGHT,
            paddingHorizontal: spacing.xlarge,
            zIndex: 90,
          },
          animatedNavbarStyle,
        ]}
      >
        <BlurView intensity={25} style={StyleSheet.absoluteFill}>
          <View style={[styles.navbarInner, { borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}>
            <Pressable onPress={handleBack} style={styles.navbarBack}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>
            
            <CustomText variant="body" weight="600" color="#FFFFFF" numberOfLines={1} style={styles.navbarTitle}>
              {destination.title}
            </CustomText>
            
            <View style={{ width: 32 }} />
          </View>
        </BlurView>
      </Animated.View>

      {/* 2. Core Scroll Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        {/* Immersive Parallax Header */}
        <DestinationHeader
          destination={destination}
          scrollOffset={scrollOffset}
        />

        {/* Storytelling Content sections */}
        <View style={[styles.detailsContent, { gap: spacing.large }]}>
          <StorySection destination={destination} />
          
          <HighlightsCarousel destination={destination} />
          
          <WeatherBudgetCard destination={destination} />
          
          <GallerySection destination={destination} />
          
          <MapReviewsSection destination={destination} />
        </View>
      </Animated.ScrollView>

      {/* 3. Sticky Bottom Action Controls */}
      <StickyBottomBar destination={destination} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skeletonContainer: {
    flex: 1,
    width: '100%',
  },
  skeletonInner: {
    marginTop: 24,
  },
  errorCard: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  errorTitle: {
    marginTop: 12,
  },
  errorSubtitle: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  errorBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  navbarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navbarBack: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  detailsContent: {
    marginTop: -12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#070709',
    paddingTop: 16,
  },
});
