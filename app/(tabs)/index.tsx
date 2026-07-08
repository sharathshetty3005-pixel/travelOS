import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';
import { Avatar } from '@/components/layout/Avatar';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { SkeletonLoader } from '@/components/feedback/SkeletonLoader';

// Home Component Imports
import { HeroSection } from '@/features/home/components/HeroSection';
import { ActiveJourneyCard } from '@/features/home/components/ActiveJourneyCard';
import { AISmartBrief } from '@/features/home/components/AISmartBrief';
import { QuickActions } from '@/features/home/components/QuickActions';
import { DiscoverSection } from '@/features/home/components/DiscoverSection';
import { ContinuePlanning } from '@/features/home/components/ContinuePlanning';
import { MemoriesPreview } from '@/features/home/components/MemoriesPreview';
import { WeatherWidget } from '@/features/home/components/WeatherWidget';

// Repository Imports
import { tripRepository } from '@/repositories/TripRepository';
import { weatherRepository } from '@/repositories/WeatherRepository';
import { destinationRepository } from '@/repositories/DestinationRepository';
import { memoryRepository } from '@/repositories/MemoryRepository';

// Type entities
import { TripEntity } from '@/mocks/trips';
import { WeatherDetailsEntity } from '@/mocks/weather';
import { DestinationEntity } from '@/mocks/destinations';
import { MemoryEntity } from '@/mocks/memories';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 64;

export default function HomeScreen() {
  const { colors, spacing, radii, isDark, shadow } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Auth state
  const user = useAuthStore((state) => state.user);

  // Data States
  const [loading, setLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState<TripEntity | null>(null);
  const [upcomingTrip, setUpcomingTrip] = useState<TripEntity | null>(null);
  const [weather, setWeather] = useState<WeatherDetailsEntity | null>(null);
  const [destinations, setDestinations] = useState<DestinationEntity[]>([]);
  const [memories, setMemories] = useState<MemoryEntity[]>([]);

  const scrollY = useSharedValue(0);

  // Scroll handler linking offsets to animate headers
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.x; // FlatList layout horizontal, or vertical scroll
      // Note: we will bind vertical scroll offset inside ScrollView below
      scrollY.value = event.contentOffset.y;
    },
  });

  // Load repositories data on mount
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [active, upcoming, dests, mems] = await Promise.all([
          tripRepository.getActiveTrip(),
          tripRepository.getUpcomingTrips(),
          destinationRepository.getFeaturedDestinations(),
          memoryRepository.getRecentMemories(),
        ]);

        setActiveTrip(active);
        if (upcoming && upcoming.length > 0) {
          setUpcomingTrip(upcoming[0]);
        }

        // Fetch weather for Positano (active trip location) or default fallback Kyoto
        const targetDest = active ? active.destinationId : 'dest-kyoto';
        const weatherDetails = await weatherRepository.getWeatherForLocation(targetDest);
        setWeather(weatherDetails);

        setDestinations(dests);
        setMemories(mems);
      } catch (error) {
        // Handled silently for mock simulation
      } finally {
        // Artificially keep loader for 700ms to showcase premium skeleton layout shimmers
        setTimeout(() => {
          setLoading(false);
        }, 700);
      }
    }

    loadDashboardData();
  }, []);

  // Animated style to fade in the floating glass search header on scroll
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 180], [0, 1], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [100, 180], [-24, 0], Extrapolate.CLAMP);
    
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const userName = user?.name || 'Guest Traveler';

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Floating Header Overlay (Visible on scroll) */}
      <Animated.View
        style={[
          styles.floatingHeader,
          {
            top: insets.top || 16,
            paddingHorizontal: spacing.xlarge,
            height: HEADER_HEIGHT,
            zIndex: 100,
          },
          animatedHeaderStyle,
        ]}
      >
        <GlassCard style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }, shadow.sm]}>
          {/* Small compact search indicator */}
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); router.push('/search'); }}
            style={[styles.searchBarCompact, { borderColor: colors.border, borderRadius: radii.s, backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="search-outline" size={14} color={colors.textSecondary} />
            <CustomText variant="caption" color={colors.textSecondary} style={styles.searchText}>
              Search TravelOS...
            </CustomText>
          </Pressable>
          
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); router.push('/profile'); }}>
            <Avatar uri={user?.avatarUrl} size="sm" name={userName} />
          </Pressable>
        </GlassCard>
      </Animated.View>

      {/* Core Scroll View container */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          // Shimmering skeleton loader blocks
          <View style={styles.skeletonContainer}>
            <SkeletonLoader width="100%" height={Dimensions.get('window').height * 0.75} borderRadius={0} />
            <View style={[styles.skeletonInner, { paddingHorizontal: spacing.xlarge, gap: spacing.large }]}>
              <SkeletonLoader width="100%" height={180} borderRadius={16} style={{ marginTop: -80 }} />
              <SkeletonLoader width="100%" height={110} borderRadius={16} />
              <View style={styles.skeletonRow}>
                <SkeletonLoader width={100} height={100} borderRadius={16} />
                <SkeletonLoader width={100} height={100} borderRadius={16} />
                <SkeletonLoader width={100} height={100} borderRadius={16} />
              </View>
              <SkeletonLoader width="100%" height={240} borderRadius={16} />
            </View>
          </View>
        ) : (
          <>
            {/* Cinematic Parallax Hero Header */}
            <HeroSection
              scrollOffset={scrollY}
              activeTrip={activeTrip}
              weather={weather}
              userName={userName}
            />

            {/* Dashboard Content Blocks */}
            <View style={[styles.dashboardContent, { backgroundColor: colors.backgroundPrimary }]}>
              {/* Active JourneyPass Card (overlaps Hero) */}
              <View style={[styles.section, { paddingHorizontal: spacing.xlarge }]}>
                <ActiveJourneyCard trip={activeTrip} />
              </View>

              {/* AI smart briefing widget */}
              <View style={[styles.section, { paddingHorizontal: spacing.xlarge, marginTop: spacing.medium }]}>
                <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); router.push('/planner'); }}>
                  <AISmartBrief trip={activeTrip} />
                </Pressable>
              </View>

              {/* Quick Actions Scroll Bar */}
              <View style={[styles.section, { marginTop: spacing.medium }]}>
                <QuickActions />
              </View>

              {/* Discover Section */}
              <View style={[styles.section, { marginTop: spacing.medium }]}>
                <View style={{ paddingHorizontal: spacing.xlarge }}>
                  <SectionHeader title="Discover New Routes" actionLabel="View All" onActionPress={() => {}} />
                </View>
                <DiscoverSection destinations={destinations} />
              </View>

              {/* Continue planning draft upcoming trips */}
              {upcomingTrip && (
                <View style={[styles.section, { paddingHorizontal: spacing.xlarge, marginTop: spacing.medium }]}>
                  <ContinuePlanning trip={upcomingTrip} />
                </View>
              )}

              {/* Weather Forecast details card */}
              <View style={[styles.section, { paddingHorizontal: spacing.xlarge, marginTop: spacing.medium }]}>
                <SectionHeader title="Local Climate Insights" />
                <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); router.push('/weather'); }}>
                  <WeatherWidget weather={weather} />
                </Pressable>
              </View>

              {/* Memory Visual ledger preview */}
              <View style={[styles.section, { marginTop: spacing.medium, marginBottom: spacing.super }]}>
                <View style={{ paddingHorizontal: spacing.xlarge }}>
                  <SectionHeader title="Captured Memories" actionLabel="Open Board" onActionPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); router.push('/memories'); }} />
                </View>
                <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); router.push('/memories'); }}>
                  <MemoriesPreview memories={memories} />
                </Pressable>
              </View>
            </View>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  headerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 0.5,
  },
  searchBarCompact: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 16,
  },
  searchText: {
    marginLeft: 8,
  },
  skeletonContainer: {
    flex: 1,
    width: '100%',
  },
  skeletonInner: {
    marginTop: 24,
    width: '100%',
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dashboardContent: {
    width: '100%',
    marginTop: -16, // Slid overlay slightly on top of Hero gradient
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
  },
  section: {
    width: '100%',
  },
});
