import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Pressable } from 'react-native';
import Svg, { Line, Circle, Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { Avatar } from '@/components/layout/Avatar';
import { DestinationEntity, mockDestinations } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REVIEWS_CARD_WIDTH = SCREEN_WIDTH * 0.72;
const RELATED_CARD_WIDTH = SCREEN_WIDTH * 0.44;

interface ReviewItem {
  id: string;
  name: string;
  avatarUrl?: string;
  country: string;
  rating: number;
  text: string;
  month: string;
}

interface MapReviewsSectionProps {
  destination: DestinationEntity;
}

export const MapReviewsSection = React.memo(function MapReviewsSection({
  destination,
}: MapReviewsSectionProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  // Curated reviews data
  const mockReviews: ReviewItem[] = [
    {
      id: 'rev-01',
      name: 'Sophia Laurent',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      country: 'France',
      rating: 5,
      text: 'Absolutely breathtaking! Every view felt like a painting. Worth every step of climb.',
      month: 'June 2026',
    },
    {
      id: 'rev-02',
      name: 'Kenji Sato',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      country: 'Japan',
      rating: 4.8,
      text: 'Incredible local hospitality and food. The scenery details left me speechless.',
      month: 'May 2026',
    },
  ];

  // Map other destinations as related spots
  const relatedDestinations = mockDestinations.filter((d) => d.id !== destination.id);

  const handleRelatedPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  return (
    <View style={styles.container}>
      {/* 1. Interactive Map Preview Mock */}
      <View style={[styles.sectionHeaderWrapper, { paddingHorizontal: spacing.xlarge }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          GEOGRAPHIC BOUNDS
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Interactive Map Preview
        </CustomText>
      </View>

      <View style={{ paddingHorizontal: spacing.xlarge }}>
        <GlassCard style={styles.mapCard}>
          {/* Topography vector background */}
          <View style={styles.mapBg} pointerEvents="none">
            <Svg width="100%" height="100%" style={styles.mapSvg}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Line
                  key={`map-line-${i}`}
                  x1={0}
                  y1={25 * i}
                  x2={SCREEN_WIDTH}
                  y2={25 * i}
                  stroke="rgba(255,255,255,0.02)"
                  strokeWidth={0.5}
                />
              ))}
              <Path
                d="M 50 40 Q 150 120 280 60 T 360 120"
                fill="none"
                stroke="rgba(212, 175, 55, 0.08)"
                strokeWidth={1}
              />
            </Svg>
          </View>

          {/* Map details overlays */}
          <View style={styles.mapHeader}>
            <View style={styles.radarWrapper}>
              <View style={[styles.radarCenter, { backgroundColor: colors.accentGold }]} />
              <View style={[styles.radarPulse, { borderColor: colors.accentGold }]} />
            </View>
            <View style={styles.mapDetails}>
              <CustomText variant="label" weight="600" color="#FFFFFF">
                Airport & Transit coordinates
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary}>
                Latitude: {destination.coordinates.latitude}° N • Longitude: {destination.coordinates.longitude}° E
              </CustomText>
            </View>
          </View>

          <View style={styles.mapFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="airplane-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color="#FFFFFF" style={styles.featureText}>
                Airport (24km)
              </CustomText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="restaurant-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color="#FFFFFF" style={styles.featureText}>
                Dining Hubs
              </CustomText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color="#FFFFFF" style={styles.featureText}>
                Luxe Hotels
              </CustomText>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* 2. Reviews Section */}
      <View style={[styles.sectionHeaderWrapper, { paddingHorizontal: spacing.xlarge, marginTop: spacing.large }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          TRAVELER FEEDBACK
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Reviews & Insights
        </CustomText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: spacing.xlarge, gap: spacing.small }]}
      >
        {mockReviews.map((rev) => (
          <GlassCard key={rev.id} style={[styles.reviewCard, shadow.sm]}>
            <View style={styles.reviewHeader}>
              <Avatar uri={rev.avatarUrl} size="sm" name={rev.name} />
              <View style={styles.reviewUser}>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  {rev.name}
                </CustomText>
                <CustomText variant="caption" color={colors.textSecondary}>
                  {rev.country} • {rev.month}
                </CustomText>
              </View>
              <View style={styles.stars}>
                <Ionicons name="star" size={10} color={colors.accentGold} />
                <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.ratingValue}>
                  {rev.rating}
                </CustomText>
              </View>
            </View>
            <CustomText variant="caption" color="rgba(255,255,255,0.8)" numberOfLines={3} style={styles.reviewText}>
              "{rev.text}"
            </CustomText>
          </GlassCard>
        ))}
      </ScrollView>

      {/* 3. Related Destinations */}
      <View style={[styles.sectionHeaderWrapper, { paddingHorizontal: spacing.xlarge, marginTop: spacing.large }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          RECOMMENDED ROUTES
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Related Destinations
        </CustomText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: spacing.xlarge, gap: spacing.small }]}
      >
        {relatedDestinations.map((spot) => (
          <Pressable key={spot.id} onPress={handleRelatedPress}>
            <GlassCard style={[styles.relatedCard, shadow.sm]}>
              <View style={styles.relatedImgBox}>
                <Image
                  source={spot.coverImage}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: radii.s }]}
                  contentFit="cover"
                />
              </View>
              <CustomText variant="caption" weight="600" color="#FFFFFF" numberOfLines={1} style={{ marginTop: spacing.tiny }}>
                {spot.title}
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary}>
                {spot.country}
              </CustomText>
            </GlassCard>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeaderWrapper: {
    width: '100%',
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 12,
  },
  mapCard: {
    height: 140,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  mapSvg: {
    ...StyleSheet.absoluteFillObject,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radarCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  radarPulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.35,
  },
  mapDetails: {
    flex: 1,
  },
  mapFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,12,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  featureText: {
    marginLeft: 4,
    fontSize: 9,
  },
  scrollContainer: {
    paddingVertical: 4,
  },
  reviewCard: {
    width: REVIEWS_CARD_WIDTH,
    padding: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUser: {
    flex: 1,
    marginLeft: 10,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    marginLeft: 3,
  },
  reviewText: {
    marginTop: 10,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  relatedCard: {
    width: RELATED_CARD_WIDTH,
    padding: 8,
  },
  relatedImgBox: {
    height: 90,
    width: '100%',
    position: 'relative',
  },
});
