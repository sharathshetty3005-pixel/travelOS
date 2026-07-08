import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';
import { WeatherDetailsEntity } from '@/mocks/weather';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const HERO_HEIGHT = SCREEN_HEIGHT * 0.76; // Golden magazine viewport (76%)

// Dynamic imagery database mapped by destination and time of day
const DYNAMIC_IMAGERY: Record<string, Record<'morning' | 'afternoon' | 'evening' | 'night', string>> = {
  'dest-amalfi': {
    morning: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop', // Amalfi soft morning sunrise
    afternoon: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop', // Amalfi bright afternoon coast
    evening: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop', // Amalfi sunset sails
    night: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop', // Amalfi night cliff lights
  },
  'dest-kyoto': {
    morning: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200&auto=format&fit=crop', // Kyoto bamboo sunrise mist
    afternoon: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop', // Kyoto bright pagoda path
    evening: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=1200&auto=format&fit=crop', // Kyoto warm sunset temple
    night: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop', // Kyoto glowing night alleyway
  },
  'dest-reykjavik': {
    morning: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=1200&auto=format&fit=crop', // Iceland morning lagoon
    afternoon: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop', // Iceland bright falls
    evening: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', // Iceland aurora skies
    night: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?q=80&w=1200&auto=format&fit=crop', // Iceland starry snow night
  },
  'dest-serengeti': {
    morning: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop', // Serengeti morning safari balloons
    afternoon: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop', // Serengeti midday savannah drive
    evening: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1200&auto=format&fit=crop', // Serengeti sunset tree silhouette
    night: 'https://images.unsplash.com/photo-1519074069444-1ba4e66640c2?q=80&w=1200&auto=format&fit=crop', // Serengeti starry wilderness
  },
};

const DEFAULT_IMAGERY = {
  morning: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  afternoon: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  evening: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
  night: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
};

interface HeroSectionProps {
  scrollOffset: Animated.SharedValue<number>;
  activeTrip: TripEntity | null;
  weather: WeatherDetailsEntity | null;
  userName?: string;
}

export const HeroSection = React.memo(function HeroSection({
  scrollOffset,
  activeTrip,
  weather,
  userName = 'Traveler',
}: HeroSectionProps) {
  const { colors, spacing, radii, isDark } = useAppTheme();
  
  const [currentTime, setCurrentTime] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  // Determine timeOfDay and update ticking clock
  useEffect(() => {
    const updateTimeAndPeriod = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;

      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);

      if (hours >= 5 && hours < 12) {
        setTimeOfDay('morning');
      } else if (hours >= 12 && hours < 17) {
        setTimeOfDay('afternoon');
      } else if (hours >= 17 && hours < 21) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeAndPeriod();
    const interval = setInterval(updateTimeAndPeriod, 60000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Good Morning';
      case 'afternoon': return 'Good Afternoon';
      case 'evening': return 'Good Evening';
      case 'night':
      default:
        return 'Good Night';
    }
  };

  // Resolve cover image dynamically based on destination & time
  const getCoverImage = () => {
    if (activeTrip) {
      const destMap = DYNAMIC_IMAGERY[activeTrip.destinationId];
      if (destMap) {
        return destMap[timeOfDay];
      }
    }
    return DEFAULT_IMAGERY[timeOfDay];
  };

  const coverImage = getCoverImage();

  // Slow parallax offset translation and elastic zoom on pull down
  const animatedBgStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.40],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollOffset.value,
      [-180, 0],
      [1.25, 1.02],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // Fade out details typography on scroll upward
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, HERO_HEIGHT * 0.55],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  // Soft gradients that darken only the lower edge to keep photography clear
  const gradientColors = isDark
    ? ['rgba(18, 18, 22, 0.0)', 'rgba(18, 18, 22, 0.35)', colors.backgroundPrimary]
    : ['rgba(247, 248, 250, 0.0)', 'rgba(247, 248, 250, 0.25)', colors.backgroundPrimary];

  const glassBg = isDark ? 'rgba(34, 34, 42, 0.45)' : 'rgba(255, 255, 255, 0.55)';
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 10, 12, 0.05)';
  const glassText = isDark ? '#FFFFFF' : 'rgb(10, 10, 12)';
  const blurTint = isDark ? 'dark' : 'light';

  return (
    <View style={[styles.container, { height: HERO_HEIGHT }]}>
      {/* Cinematic Cover Background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedBgStyle]}>
        <Image
          source={coverImage}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={400}
        />
        
        {/* Editorial Linear Gradient fading into canvas */}
        <LinearGradient
          colors={gradientColors as any}
          locations={[0.0, 0.55, 1.0]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Floating Glassmorphic Badges and Details */}
      <Animated.View style={[styles.textOverlay, { paddingHorizontal: spacing.xlarge }, animatedTextStyle]}>
        <View style={styles.topRow}>
          {activeTrip ? (
            <View style={[styles.glassBadgeWrapper, { borderRadius: radii.s }]}>
              <BlurView intensity={20} tint={blurTint} style={[styles.glassBadge, { backgroundColor: glassBg, borderColor: glassBorder }]}>
                <Ionicons name="sparkles" size={10} color={colors.accentGold} />
                <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.badgeText}>
                  {activeTrip.countdownDays} DAYS TO DEPARTURE
                </CustomText>
              </BlurView>
            </View>
          ) : (
            <View style={[styles.glassBadgeWrapper, { borderRadius: radii.s }]}>
              <BlurView intensity={20} tint={blurTint} style={[styles.glassBadge, { backgroundColor: glassBg, borderColor: glassBorder }]}>
                <Ionicons name="compass-outline" size={10} color={colors.accentGold} />
                <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.badgeText}>
                  PLAN YOUR RETREAT
                </CustomText>
              </BlurView>
            </View>
          )}

          <View style={[styles.glassBadgeWrapper, { borderRadius: radii.s }]}>
            <BlurView intensity={20} tint={blurTint} style={[styles.glassBadge, { backgroundColor: glassBg, borderColor: glassBorder }]}>
              <CustomText variant="caption" weight="600" color={glassText}>
                {currentTime}
              </CustomText>
            </BlurView>
          </View>
        </View>

        {/* Minimal Editorial typography */}
        <CustomText variant="display" weight="600" color={glassText} style={styles.greeting}>
          {getGreeting()}, {userName}
        </CustomText>

        {activeTrip && (
          <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.destinationName}>
            {activeTrip.location.toUpperCase()}
          </CustomText>
        )}

        {/* Weather chip and timezone details */}
        {weather && (
          <View style={styles.weatherDetails}>
            <View style={[styles.glassBadgeWrapper, { borderRadius: radii.m }]}>
              <BlurView intensity={20} tint={blurTint} style={[styles.glassBadge, { backgroundColor: glassBg, borderColor: glassBorder }]}>
                <Ionicons name="sunny-outline" size={13} color={colors.accentGold} />
                <CustomText variant="caption" weight="600" color={glassText} style={styles.weatherStatText}>
                  {weather.temp}°C {weather.condition}
                </CustomText>
              </BlurView>
            </View>

            <View style={[styles.glassBadgeWrapper, { borderRadius: radii.m }]}>
              <BlurView intensity={20} tint={blurTint} style={[styles.glassBadge, { backgroundColor: glassBg, borderColor: glassBorder }]}>
                <Ionicons name="time-outline" size={13} color={colors.accentGold} />
                <CustomText variant="caption" weight="600" color={glassText} style={styles.weatherStatText}>
                  Local time (UTC+2)
                </CustomText>
              </BlurView>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 110, // Leaves room for overlapping ActiveJourneyCard
    left: 0,
    right: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  glassBadgeWrapper: {
    overflow: 'hidden',
  },
  glassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 0.5,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  greeting: {
    lineHeight: 42,
    letterSpacing: -0.2,
  },
  destinationName: {
    marginTop: 6,
    letterSpacing: 1.5,
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  weatherStatText: {
    marginLeft: 4,
  },
});
