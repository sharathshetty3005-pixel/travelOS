import React from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Data grouping entities for editorial grids
export interface EditorialRow {
  id: string;
  type: 'wide' | 'pair';
  wideItem?: DestinationEntity;
  leftItem?: DestinationEntity;
  rightItem?: DestinationEntity;
}

// Staggers items: Index 0 is Wide, Index 1 & 2 are grouped side-by-side
export function buildEditorialRows(destinations: DestinationEntity[]): EditorialRow[] {
  const rows: EditorialRow[] = [];
  let i = 0;
  while (i < destinations.length) {
    if (i % 3 === 0) {
      rows.push({
        id: `row-wide-${destinations[i].id}`,
        type: 'wide',
        wideItem: destinations[i],
      });
      i++;
    } else {
      rows.push({
        id: `row-pair-${destinations[i].id}`,
        type: 'pair',
        leftItem: destinations[i],
        rightItem: destinations[i + 1] || undefined,
      });
      i += 2;
    }
  }
  return rows;
}

interface CardProps {
  item: DestinationEntity;
  height: number;
  width: number;
  showTagline?: boolean;
}

// Core Image and overlay component wrapped in spring scale gesture
export const EditorialCard = React.memo(function EditorialCard({
  item,
  height,
  width,
  showTagline = false,
}: CardProps) {
  const { colors, radii, spacing, shadow, animation } = useAppTheme();
  const router = useRouter();
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, animation.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, animation.spring.snappy);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push(`/destination/${item.id}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Explore ${item.title}`}
      style={{ width }}
    >
      <Animated.View style={animatedStyle}>
        <GlassCard style={[styles.card, shadow.sm, { height, padding: 8 }]}>
          <View style={styles.imageContainer}>
            <Image
              source={item.coverImage}
              style={[StyleSheet.absoluteFillObject, { borderRadius: radii.m }]}
              contentFit="cover"
              transition={200}
            />
            {/* Top match score indicator */}
            <View style={[styles.matchBadge, { backgroundColor: 'rgba(10, 10, 12, 0.75)', borderRadius: radii.s }]}>
              <Ionicons name="sparkles" size={10} color={colors.accentGold} />
              <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.matchText}>
                {Math.round(item.rating * 20)}% MATCH
              </CustomText>
            </View>

            {/* Bottom details text box */}
            <View style={styles.overlayTextContainer}>
              <CustomText variant="label" weight="600" color="#FFFFFF">
                {item.title}
              </CustomText>
              
              <CustomText variant="caption" color="rgba(255, 255, 255, 0.7)" style={styles.country}>
                {item.country} • {item.averageCost}
              </CustomText>

              {showTagline && (
                <CustomText variant="caption" color={colors.accentGold} numberOfLines={1} style={styles.tagline}>
                  "{item.tagline}"
                </CustomText>
              )}
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
});

// Layout card taking full viewport width
export const WideCard = React.memo(function WideCard({ item }: { item: DestinationEntity }) {
  const { spacing } = useAppTheme();
  const width = SCREEN_WIDTH - 2 * spacing.xlarge;
  return <EditorialCard item={item} height={190} width={width} showTagline />;
});

// Layout row grouping left Tall card and right Square card side-by-side
export const StaggeredPairRow = React.memo(function StaggeredPairRow({
  left,
  right,
}: {
  left: DestinationEntity;
  right?: DestinationEntity;
}) {
  const { spacing } = useAppTheme();
  
  // Distribute widths evenly subtracting columns padding gaps
  const columnWidth = (SCREEN_WIDTH - 2 * spacing.xlarge - spacing.small) / 2;

  return (
    <View style={[styles.pairRow, { gap: spacing.small }]}>
      <EditorialCard item={left} height={240} width={columnWidth} />
      
      {right ? (
        <View style={styles.rightColWrapper}>
          <EditorialCard item={right} height={180} width={columnWidth} />
        </View>
      ) : (
        <View style={{ width: columnWidth }} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
    zIndex: 10,
  },
  matchText: {
    marginLeft: 3,
    fontSize: 9,
  },
  overlayTextContainer: {
    backgroundColor: 'rgba(10, 10, 12, 0.55)',
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  country: {
    marginTop: 1,
  },
  tagline: {
    marginTop: 3,
    fontStyle: 'italic',
  },
  pairRow: {
    flexDirection: 'row',
    width: '100%',
  },
  rightColWrapper: {
    justifyContent: 'flex-start',
  },
});
