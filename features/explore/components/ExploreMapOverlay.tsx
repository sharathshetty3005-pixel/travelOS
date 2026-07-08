import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Line, Circle, Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ExploreMapOverlayProps {
  destinations: DestinationEntity[];
  onClose: () => void;
}

export const ExploreMapOverlay = React.memo(function ExploreMapOverlay({
  destinations,
  onClose,
}: ExploreMapOverlayProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();
  
  const [selectedDest, setSelectedDest] = useState<DestinationEntity | null>(null);

  // Reanimated values for sliding card
  const cardTranslateY = useSharedValue(SCREEN_HEIGHT * 0.4);

  useEffect(() => {
    if (selectedDest) {
      cardTranslateY.value = withSpring(0, { damping: 15 });
    } else {
      cardTranslateY.value = withSpring(SCREEN_HEIGHT * 0.4);
    }
  }, [selectedDest]);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  const handlePinPress = (dest: DestinationEntity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedDest(dest);
  };

  const handleCloseCard = () => {
    setSelectedDest(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#070709' }]}>
      {/* Background Sat-Nav Topography Mesh */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={styles.svgGrid}>
          {/* Fine Grid Mesh */}
          {Array.from({ length: 15 }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <Line
                x1={0}
                y1={(SCREEN_HEIGHT / 15) * i}
                x2={SCREEN_WIDTH}
                y2={(SCREEN_HEIGHT / 15) * i}
                stroke="rgba(212, 175, 55, 0.05)"
                strokeWidth={0.5}
              />
              <Line
                x1={(SCREEN_WIDTH / 10) * i}
                y1={0}
                x2={(SCREEN_WIDTH / 10) * i}
                y2={SCREEN_HEIGHT}
                stroke="rgba(212, 175, 55, 0.05)"
                strokeWidth={0.5}
              />
            </React.Fragment>
          ))}
          {/* Mock Continent outlines */}
          <Path
            d={`M ${SCREEN_WIDTH * 0.1} ${SCREEN_HEIGHT * 0.3} Q ${SCREEN_WIDTH * 0.3} ${SCREEN_HEIGHT * 0.25} ${SCREEN_WIDTH * 0.5} ${SCREEN_HEIGHT * 0.4} T ${SCREEN_WIDTH * 0.9} ${SCREEN_HEIGHT * 0.3}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={1.5}
          />
          <Path
            d={`M ${SCREEN_WIDTH * 0.2} ${SCREEN_HEIGHT * 0.6} Q ${SCREEN_WIDTH * 0.4} ${SCREEN_HEIGHT * 0.75} ${SCREEN_WIDTH * 0.6} ${SCREEN_HEIGHT * 0.6} T ${SCREEN_WIDTH * 0.8} ${SCREEN_HEIGHT * 0.8}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={1.5}
          />
        </Svg>
      </View>

      {/* Header Bar */}
      <View style={[styles.headerRow, { top: spacing.xlarge + 12 }]}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Back to search list"
          style={[styles.backBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        
        <CustomText variant="body" weight="600" color={colors.textPrimary}>
          MAP VIEWER
        </CustomText>
        
        <View style={{ width: 40 }} />
      </View>

      {/* Floating Radar Pins */}
      {destinations.map((dest, index) => {
        // Map destination coordinates to screen offset positions
        // Amalfi (Europe), Kyoto (Asia), Serengeti (Africa), Reykjavik (North Europe)
        // We use hardcoded coordinates scaling to make them spread out nicely on the screen map
        const positions = [
          { x: SCREEN_WIDTH * 0.35, y: SCREEN_HEIGHT * 0.38 }, // Amalfi
          { x: SCREEN_WIDTH * 0.78, y: SCREEN_HEIGHT * 0.42 }, // Kyoto
          { x: SCREEN_WIDTH * 0.22, y: SCREEN_HEIGHT * 0.26 }, // Reykjavik
          { x: SCREEN_WIDTH * 0.48, y: SCREEN_HEIGHT * 0.58 }, // Serengeti
        ];

        const pos = positions[index % positions.length];

        return (
          <MapPin
            key={dest.id}
            x={pos.x}
            y={pos.y}
            active={selectedDest?.id === dest.id}
            onPress={() => handlePinPress(dest)}
          />
        );
      })}

      {/* Slide up Detail Board */}
      <Animated.View style={[styles.bottomCardContainer, { paddingHorizontal: spacing.xlarge, paddingBottom: spacing.xlarge + 10 }, animatedCardStyle]}>
        {selectedDest && (
          <GlassCard style={[styles.detailCard, shadow.lg]}>
            <View style={styles.cardHeader}>
              <View style={styles.imageCol}>
                <Image source={selectedDest.coverImage} style={[styles.thumbnail, { borderRadius: radii.s }]} contentFit="cover" />
              </View>

              <View style={styles.infoCol}>
                <View style={styles.titleRow}>
                  <CustomText variant="label" weight="600" color="#FFFFFF">
                    {selectedDest.title}
                  </CustomText>
                  <Pressable onPress={handleCloseCard} style={styles.closeBtn}>
                    <Ionicons name="close" size={18} color={colors.textSecondary} />
                  </Pressable>
                </View>

                <CustomText variant="caption" color="rgba(255,255,255,0.6)">
                  {selectedDest.country} • {selectedDest.averageCost}
                </CustomText>

                <View style={[styles.scoreRow, { marginTop: spacing.tiny }]}>
                  <Ionicons name="sparkles" size={10} color={colors.accentGold} />
                  <CustomText variant="caption" weight="600" color={colors.accentGold} style={styles.scoreText}>
                    {Math.round(selectedDest.rating * 20)}% Match
                  </CustomText>
                </View>
              </View>
            </View>

            <CustomText variant="caption" color="rgba(255,255,255,0.8)" numberOfLines={2} style={[styles.description, { marginTop: spacing.small }]}>
              {selectedDest.description}
            </CustomText>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              }}
              style={[styles.routeBtn, { backgroundColor: colors.accentGold, borderRadius: radii.s, marginTop: spacing.medium }]}
            >
              <CustomText variant="caption" weight="700" color="#000000">
                PLAN AI TRIP ROUTE
              </CustomText>
            </Pressable>
          </GlassCard>
        )}
      </Animated.View>
    </View>
  );
});

// Glowing Radar Map Pin Component
function MapPin({
  x,
  y,
  active,
  onPress,
}: {
  x: number;
  y: number;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  
  // Radial expand animations
  const pulse = useSharedValue(0.8);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.6, { duration: 1600 }),
      -1, // infinite
      false // don't reverse
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: interpolate(pulse.value, [0.8, 1.6], [0.6, 0]),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pinWrapper, { left: x - 20, top: y - 20 }]}
    >
      {/* Outer Pulse glow circle */}
      <Animated.View
        style={[
          styles.pulseCircle,
          { backgroundColor: active ? colors.accentGold : 'rgba(255,255,255,0.4)' },
          animatedPulseStyle,
        ]}
      />

      {/* Center core point */}
      <View
        style={[
          styles.corePoint,
          {
            backgroundColor: active ? '#FFFFFF' : colors.accentGold,
            borderColor: active ? colors.accentGold : '#FFFFFF',
            borderWidth: 1.5,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  svgGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 0.5,
  },
  pinWrapper: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  corePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  detailCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  imageCol: {
    marginRight: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    marginLeft: 3,
    fontSize: 9,
  },
  description: {
    lineHeight: 18,
  },
  routeBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
