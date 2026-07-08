import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.84; // Massive visual size
const CARD_MARGIN = 10;

interface DiscoverSectionProps {
  destinations: DestinationEntity[];
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const DiscoverSection = React.memo(function DiscoverSection({
  destinations,
}: DiscoverSectionProps) {
  const { spacing } = useAppTheme();
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <AnimatedFlatList
      horizontal
      data={destinations}
      keyExtractor={(item: any) => item.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
      decelerationRate="fast"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingHorizontal: spacing.xlarge - CARD_MARGIN,
      }}
      renderItem={({ item, index }: any) => (
        <DiscoverCard item={item} index={index} scrollX={scrollX} />
      )}
    />
  );
});

// Redesigned Discover Card
function DiscoverCard({
  item,
  index,
  scrollX,
}: {
  item: DestinationEntity;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const { colors, radii, spacing, shadow } = useAppTheme();

  // Scroll scale and parallax calculations
  const animatedCardStyle = useAnimatedStyle(() => {
    const step = CARD_WIDTH + CARD_MARGIN * 2;
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * step, index * step, (index + 1) * step],
      [0.96, 1.0, 0.96],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push(`/destination/${item.id}` as any);
  };

  return (
    <Pressable onPress={handlePress} style={styles.cardContainer}>
      <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
        <GlassCard style={[styles.card, shadow.md]}>
          <View style={styles.imageContainer}>
            <Image
              source={item.coverImage}
              style={[StyleSheet.absoluteFillObject, { borderRadius: radii.m }]}
              contentFit="cover"
              transition={250}
            />
            {/* Top Match Tag */}
            <View style={[styles.matchTag, { backgroundColor: 'rgba(10,10,12,0.8)', borderRadius: radii.s }]}>
              <Ionicons name="sparkles" size={10} color={colors.accentGold} />
              <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.matchText}>
                {Math.round(item.rating * 20)}% MATCH
              </CustomText>
            </View>

            {/* Bottom metadata details row */}
            <View style={styles.textOverlay}>
              <CustomText variant="title" weight="700" color="#FFFFFF">
                {item.title}
              </CustomText>
              
              <CustomText variant="caption" color="rgba(255, 255, 255, 0.8)" style={styles.subtitle}>
                {item.country} • {item.averageCost}
              </CustomText>

              <CustomText variant="caption" color={colors.accentGold} style={styles.tagline} numberOfLines={1}>
                "{item.tagline}"
              </CustomText>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 12,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  card: {
    padding: 10,
    borderWidth: 0.5,
  },
  imageContainer: {
    height: 220, // Tall magazine visual aspect
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  matchTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  matchText: {
    marginLeft: 4,
    fontSize: 9,
  },
  textOverlay: {
    backgroundColor: 'rgba(10, 10, 12, 0.65)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  subtitle: {
    marginTop: 2,
  },
  tagline: {
    marginTop: 4,
    fontStyle: 'italic',
  },
});
