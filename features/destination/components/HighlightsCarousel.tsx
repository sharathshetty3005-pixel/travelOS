import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { DestinationEntity } from '@/mocks/destinations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.72;

interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  cost: string;
  rating: number;
  matchScore: number;
  imageUrl: string;
}

interface HighlightsCarouselProps {
  destination: DestinationEntity;
}

export const HighlightsCarousel = React.memo(function HighlightsCarousel({
  destination,
}: HighlightsCarouselProps) {
  const { colors, spacing } = useAppTheme();

  // Curated premium local experience assets mapped to destination keys
  const getExperienceData = (destId: string): ExperienceItem[] => {
    switch (destId) {
      case 'dest-amalfi':
        return [
          {
            id: 'exp-amalfi-01',
            title: 'Emerald Grotto Charter',
            description: 'Private wooden boat excursion inside hidden coastal chambers reflecting mineral green rays.',
            duration: '2 hours',
            cost: '$80/person',
            rating: 4.85,
            matchScore: 98,
            imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=400&auto=format&fit=crop',
          },
          {
            id: 'exp-amalfi-02',
            title: 'Ravello Cliffside Gardens',
            description: 'Walk through historic Villa Cimbrone gardens hanging over Amalfi coastlines.',
            duration: '3 hours',
            cost: '$15/person',
            rating: 4.9,
            matchScore: 95,
            imageUrl: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=400&auto=format&fit=crop',
          },
        ];
      case 'dest-kyoto':
        return [
          {
            id: 'exp-kyoto-01',
            title: 'Fushimi Inari Torii Paths Hike',
            description: 'Hike through thousands of vibrant orange torii gates wrapping mountaintop shrines.',
            duration: '3.5 hours',
            cost: 'Free',
            rating: 4.92,
            matchScore: 99,
            imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop',
          },
          {
            id: 'exp-kyoto-02',
            title: 'Zen Meditation & Tea Ceremony',
            description: 'Traditional tea matcha whisking inside an authentic 400-year-old temple quarter.',
            duration: '2 hours',
            cost: '$45/person',
            rating: 4.88,
            matchScore: 96,
            imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=400&auto=format&fit=crop',
          },
        ];
      case 'dest-reykjavik':
        return [
          {
            id: 'exp-reykjavik-01',
            title: 'Blue Lagoon Geothermal Soak',
            description: 'Relax inside mineral-rich, milky-blue geothermal springs heated by volcanic vents.',
            duration: '4 hours',
            cost: '$90/person',
            rating: 4.9,
            matchScore: 97,
            imageUrl: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?q=80&w=400&auto=format&fit=crop',
          },
          {
            id: 'exp-reykjavik-02',
            title: 'Midnight Sun Aurora chase',
            description: 'Explore active geysers and massive Gullfoss cascades along the Golden circle track.',
            duration: '6 hours',
            cost: '$110/person',
            rating: 4.82,
            matchScore: 94,
            imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop',
          },
        ];
      case 'dest-serengeti':
      default:
        return [
          {
            id: 'exp-serengeti-01',
            title: 'Sunrise Hot Air Balloon Flight',
            description: 'Drift silently over the savannah watching herds migrate in the early morning rays.',
            duration: '3 hours',
            cost: '$450/person',
            rating: 4.98,
            matchScore: 99,
            imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=400&auto=format&fit=crop',
          },
          {
            id: 'exp-serengeti-02',
            title: 'Big Five Predator Drive',
            description: 'Guided wilderness truck drive tracking lions, leopards, rhinos, and elephants.',
            duration: '8 hours',
            cost: '$140/person',
            rating: 4.9,
            matchScore: 97,
            imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=400&auto=format&fit=crop',
          },
        ];
    }
  };

  const experiences = getExperienceData(destination.id);

  return (
    <View style={styles.container}>
      {/* 1. Highlights Track */}
      <View style={styles.sectionHeaderWrapper}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          SIGNATURE LANDMARKS
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Highlights
        </CustomText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: spacing.xlarge, gap: spacing.small }]}
      >
        {destination.highlights.map((highlight, index) => (
          <GlassCard key={`hl-${index}`} style={styles.highlightCard}>
            <Ionicons name="location-outline" size={16} color={colors.accentGold} style={styles.hlIcon} />
            <View style={styles.hlTextContainer}>
              <CustomText variant="label" weight="600" color="#FFFFFF">
                {highlight}
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary} style={styles.hlSub}>
                Featured Spot • Recommended
              </CustomText>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      {/* 2. Top Experiences Track */}
      <View style={[styles.sectionHeaderWrapper, { marginTop: spacing.large }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          EDITORIAL PLANNED OUTINGS
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Top Recommended Experiences
        </CustomText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: spacing.xlarge, gap: spacing.small }]}
      >
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} item={exp} />
        ))}
      </ScrollView>
    </View>
  );
});

// Staggered interactive recommended card
function ExperienceCard({ item }: { item: ExperienceItem }) {
  const { colors, radii, spacing, shadow, animation } = useAppTheme();
  
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Book experience ${item.title}`}
    >
      <Animated.View style={[animatedStyle, { width: CARD_WIDTH }]}>
        <GlassCard style={[styles.expCard, shadow.sm]}>
          <View style={styles.imageBox}>
            <Image
              source={item.imageUrl}
              style={[StyleSheet.absoluteFillObject, { borderRadius: radii.m }]}
              contentFit="cover"
            />
            {/* Top Match details */}
            <View style={[styles.expMatchTag, { backgroundColor: 'rgba(10,10,12,0.85)', borderRadius: radii.s }]}>
              <Ionicons name="sparkles" size={10} color={colors.accentGold} />
              <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.tagText}>
                {item.matchScore}% MATCH
              </CustomText>
            </View>
          </View>

          <View style={[styles.expMeta, { marginTop: spacing.small }]}>
            <View style={styles.titleRow}>
              <CustomText variant="label" weight="600" color="#FFFFFF" numberOfLines={1} style={styles.expTitle}>
                {item.title}
              </CustomText>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color={colors.accentGold} />
                <CustomText variant="caption" weight="600" color="#FFFFFF" style={styles.ratingText}>
                  {item.rating}
                </CustomText>
              </View>
            </View>

            <CustomText variant="caption" color={colors.textSecondary} numberOfLines={2} style={styles.expDesc}>
              {item.description}
            </CustomText>

            <View style={styles.divider} />

            <View style={styles.expBottom}>
              <CustomText variant="caption" color={colors.textSecondary}>
                {item.duration}
              </CustomText>
              <CustomText variant="caption" weight="600" color={colors.accentGold}>
                {item.cost}
              </CustomText>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeaderWrapper: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 12,
  },
  scrollContainer: {
    paddingVertical: 4,
  },
  highlightCard: {
    width: 220,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hlIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  hlTextContainer: {
    flex: 1,
  },
  hlSub: {
    marginTop: 2,
  },
  expCard: {
    padding: 10,
  },
  imageBox: {
    height: 130,
    width: '100%',
    position: 'relative',
  },
  expMatchTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  tagText: {
    marginLeft: 3,
    fontSize: 9,
  },
  expMeta: {
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expTitle: {
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 3,
  },
  expDesc: {
    marginTop: 4,
    lineHeight: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 10,
  },
  expBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
