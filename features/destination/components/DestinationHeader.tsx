import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const HERO_HEIGHT = SCREEN_WIDTH * 1.1;

interface DestinationHeaderProps {
  destination: DestinationEntity;
  scrollOffset: Animated.SharedValue<number>;
}

export const DestinationHeader = React.memo(function DestinationHeader({
  destination,
  scrollOffset,
}: DestinationHeaderProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isFavorited, setIsFavorited] = useState(false);

  // Parallax translating & elastic stretching
  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [-200, 0],
      [1.4, 1.05],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.45],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  // Fade out details overlay as user scrolls upward
  const animatedDetailsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, HERO_HEIGHT * 0.65],
      [1, 0],
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

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setIsFavorited((prev) => !prev);
  };

  return (
    <View style={[styles.container, { height: HERO_HEIGHT }]}>
      {/* Cover Image Parallax */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedImageStyle]}>
        <Image
          source={destination.coverImage}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        {/* Editorial gradient sheets */}
        <View style={styles.topGradient} />
        <View style={[styles.bottomGradient, { backgroundColor: 'rgba(7, 7, 9, 0.92)' }]} />
      </Animated.View>

      {/* Floating navigation buttons (Header Overlay) */}
      <View style={[styles.navOverlay, { top: insets.top || 16, paddingHorizontal: spacing.xlarge }]}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
          style={[styles.glassBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Pressable
          onPress={handleFavorite}
          accessibilityRole="button"
          accessibilityLabel={isFavorited ? "Remove from favorites" : "Add to favorites"}
          style={[styles.glassBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        >
          <Ionicons
            name={isFavorited ? "bookmark" : "bookmark-outline"}
            size={18}
            color={isFavorited ? colors.accentGold : colors.textPrimary}
          />
        </Pressable>
      </View>

      {/* Hero Bottom text card */}
      <Animated.View style={[styles.detailsOverlay, { paddingHorizontal: spacing.xlarge }, animatedDetailsStyle]}>
        <View style={styles.badgeRow}>
          <View style={[styles.matchBadge, { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: colors.accentGold }]}>
            <Ionicons name="sparkles" size={10} color={colors.accentGold} />
            <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.matchText}>
              {Math.round(destination.rating * 20)}% MATCH SCORE
            </CustomText>
          </View>
        </View>

        <CustomText variant="display" weight="700" color="#FFFFFF" style={styles.title}>
          {destination.title}
        </CustomText>

        <CustomText variant="body" color="rgba(255,255,255,0.7)" style={styles.country}>
          {destination.country} • {destination.averageCost}
        </CustomText>

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Ionicons name="sunny-outline" size={14} color={colors.accentGold} />
            <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.statText}>
              {destination.weather.temp}°C {destination.weather.condition}
            </CustomText>
          </View>

          <View style={styles.statCol}>
            <Ionicons name="time-outline" size={14} color={colors.accentGold} />
            <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.statText}>
              UTC+2 (Local Time)
            </CustomText>
          </View>
        </View>
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
  topGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    opacity: 0.95,
  },
  navOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  glassBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  matchText: {
    marginLeft: 4,
    fontSize: 9,
  },
  title: {
    lineHeight: 46,
  },
  country: {
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  statCol: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statText: {
    marginLeft: 4,
  },
});
