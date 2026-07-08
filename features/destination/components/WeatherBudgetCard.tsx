import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { DestinationEntity } from '@/mocks/destinations';

interface WeatherBudgetCardProps {
  destination: DestinationEntity;
}

type BudgetTier = 'Backpacker' | 'Comfort' | 'Luxury';

interface BudgetDetails {
  daily: string;
  lodging: string;
  food: string;
  transport: string;
  activities: string;
}

const BUDGET_PROFILES: Record<string, Record<BudgetTier, BudgetDetails>> = {
  'dest-amalfi': {
    Backpacker: { daily: '$90/day', lodging: 'Shared Hostels', food: 'Pizza slices & street cafes', transport: 'SITA Local Buses', activities: 'Free public beaches & hiking' },
    Comfort: { daily: '$280/day', lodging: '3-star boutique BnBs', food: 'Cliffside Trattoria dinners', transport: 'Scooter rentals', activities: 'Ferry transfers & Grotto entry' },
    Luxury: { daily: '$950/day', lodging: 'Le Sirenuse Sea Suites', food: 'Michelin fine dining', transport: 'Private yacht charter', activities: 'Helicopter flights & yacht days' },
  },
  'dest-kyoto': {
    Backpacker: { daily: '$60/day', lodging: 'Traditional Capsule Hostels', food: 'Ramen joints & bento boxes', transport: 'Subway IC cards', activities: 'Free temple gates & forest walks' },
    Comfort: { daily: '$190/day', lodging: 'Boutique Ryokan inns', food: 'Izakaya dinners & tea tastings', transport: 'Taxis & local train lines', activities: 'Kinkaku-ji entry & Zen meditation' },
    Luxury: { daily: '$680/day', lodging: 'Hoshinoya Kyoto Pavillion', food: 'Kiseki traditional courses', transport: 'Private luxury chauffeur', activities: 'Exclusive private shrine guides' },
  },
  'dest-reykjavik': {
    Backpacker: { daily: '$85/day', lodging: 'Campgrounds / Shared cabins', food: 'Grocery prep & local bakeries', transport: 'Shared rental cars', activities: 'Free thermal rivers & parks' },
    Comfort: { daily: '$260/day', lodging: '4-star downtown flats', food: 'New Nordic sit-down bistros', transport: 'Compact SUV rentals', activities: 'Geysers tours & Blue Lagoon entry' },
    Luxury: { daily: '$850/day', lodging: 'The Retreat at Blue Lagoon', food: 'Lava Restaurant dining', transport: 'Modified Super-jeep charters', activities: 'Glacier ice cave helicopter rides' },
  },
  'dest-serengeti': {
    Backpacker: { daily: '$120/day', lodging: 'Basic shared campsites', food: 'Campfire chef prep', transport: 'Group safari trucks', activities: 'Standard park gate drives' },
    Comfort: { daily: '$350/day', lodging: 'Mid-range tented lodges', food: 'Lodge buffet dining', transport: '4x4 land cruisers', activities: 'Park wildlife safaris' },
    Luxury: { daily: '$1200/day', lodging: 'Singita Sabora Luxury Tents', food: 'Private customized cooking', transport: 'Private safari aircraft', activities: 'Sunrise balloons & night drives' },
  },
};

export const WeatherBudgetCard = React.memo(function WeatherBudgetCard({
  destination,
}: WeatherBudgetCardProps) {
  const { colors, spacing, radii } = useAppTheme();
  
  const [activeTier, setActiveTier] = useState<BudgetTier>('Comfort');

  const handleTierPress = (tier: BudgetTier) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setActiveTier(tier);
  };

  // Weather specifications based on destination
  const getWeatherSpecs = (destId: string) => {
    switch (destId) {
      case 'dest-amalfi':
        return { bestMonths: 'May - September', rainRisk: '12%', sunrise: '5:34 AM', sunset: '8:42 PM' };
      case 'dest-kyoto':
        return { bestMonths: 'April & November', rainRisk: '22%', sunrise: '6:12 AM', sunset: '5:18 PM' };
      case 'dest-reykjavik':
        return { bestMonths: 'July & August', rainRisk: '48%', sunrise: '2:45 AM', sunset: '11:58 PM' };
      case 'dest-serengeti':
      default:
        return { bestMonths: 'June - October', rainRisk: '8%', sunrise: '6:22 AM', sunset: '6:45 PM' };
    }
  };

  const weatherSpecs = getWeatherSpecs(destination.id);
  
  const budgets = BUDGET_PROFILES[destination.id] || BUDGET_PROFILES['dest-amalfi'];
  const activeBudget = budgets[activeTier];

  return (
    <View style={styles.container}>
      {/* 1. Weather Glass Panel */}
      <View style={[styles.sectionHeaderWrapper, { paddingHorizontal: spacing.xlarge }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          CLIMATE SUMMARY
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Weather & Best Time
        </CustomText>
      </View>

      <View style={{ paddingHorizontal: spacing.xlarge }}>
        <GlassCard style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <View style={styles.weatherMain}>
              <CustomText variant="display" weight="700" color="#FFFFFF">
                {destination.weather.temp}°C
              </CustomText>
              <CustomText variant="caption" color="rgba(255,255,255,0.7)">
                Current condition: {destination.weather.condition}
              </CustomText>
            </View>
            <Ionicons name="sunny-outline" size={40} color={colors.accentGold} />
          </View>

          <View style={styles.divider} />

          <View style={styles.weatherGrid}>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.accentGold} style={styles.gridIcon} />
                <View>
                  <CustomText variant="caption" color={colors.textSecondary}>
                    BEST MONTHS
                  </CustomText>
                  <CustomText variant="caption" weight="600" color="#FFFFFF">
                    {weatherSpecs.bestMonths}
                  </CustomText>
                </View>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="rainy-outline" size={14} color={colors.accentGold} style={styles.gridIcon} />
                <View>
                  <CustomText variant="caption" color={colors.textSecondary}>
                    RAIN RISK
                  </CustomText>
                  <CustomText variant="caption" weight="600" color="#FFFFFF">
                    {weatherSpecs.rainRisk} average
                  </CustomText>
                </View>
              </View>
            </View>

            <View style={[styles.gridRow, { marginTop: spacing.small }]}>
              <View style={styles.gridItem}>
                <Ionicons name="sunny" size={14} color={colors.accentGold} style={styles.gridIcon} />
                <View>
                  <CustomText variant="caption" color={colors.textSecondary}>
                    SUNRISE
                  </CustomText>
                  <CustomText variant="caption" weight="600" color="#FFFFFF">
                    {weatherSpecs.sunrise}
                  </CustomText>
                </View>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="moon-outline" size={14} color={colors.accentGold} style={styles.gridIcon} />
                <View>
                  <CustomText variant="caption" color={colors.textSecondary}>
                    SUNSET
                  </CustomText>
                  <CustomText variant="caption" weight="600" color="#FFFFFF">
                    {weatherSpecs.sunset}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* 2. Budget Overview Tiers */}
      <View style={[styles.sectionHeaderWrapper, { paddingHorizontal: spacing.xlarge, marginTop: spacing.large }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          SPENDING INDEX
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Budget Overview
        </CustomText>
      </View>

      <View style={{ paddingHorizontal: spacing.xlarge }}>
        {/* Tier Selector Chips */}
        <View style={[styles.tierRow, { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radii.m, borderColor: colors.border, borderWidth: 0.5 }]}>
          {(['Backpacker', 'Comfort', 'Luxury'] as BudgetTier[]).map((tier) => {
            const active = activeTier === tier;
            return (
              <Pressable
                key={tier}
                onPress={() => handleTierPress(tier)}
                style={[
                  styles.tierBtn,
                  active && { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderRadius: radii.m - 2 },
                ]}
              >
                <CustomText
                  variant="caption"
                  weight="600"
                  color={active ? colors.accentGold : colors.textSecondary}
                >
                  {tier}
                </CustomText>
              </Pressable>
            );
          })}
        </View>

        {/* Budget Details display */}
        <GlassCard style={[styles.budgetCard, { marginTop: spacing.small }]}>
          <View style={styles.budgetHeader}>
            <View>
              <CustomText variant="caption" color={colors.textSecondary}>
                DAILY ESTIMATED SPEND
              </CustomText>
              <CustomText variant="title" weight="700" color={colors.accentGold} style={styles.dailyPrice}>
                {activeBudget.daily}
              </CustomText>
            </View>
            <Ionicons name="stats-chart" size={24} color={colors.accentGold} />
          </View>

          <View style={styles.divider} />

          <View style={styles.budgetBreakdown}>
            <View style={styles.breakdownRow}>
              <Ionicons name="bed-outline" size={14} color={colors.textSecondary} style={styles.breakdownIcon} />
              <View style={styles.breakdownText}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  LODGING
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  {activeBudget.lodging}
                </CustomText>
              </View>
            </View>

            <View style={styles.breakdownRow}>
              <Ionicons name="restaurant-outline" size={14} color={colors.textSecondary} style={styles.breakdownIcon} />
              <View style={styles.breakdownText}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  MEALS & DINING
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  {activeBudget.food}
                </CustomText>
              </View>
            </View>

            <View style={styles.breakdownRow}>
              <Ionicons name="bus-outline" size={14} color={colors.textSecondary} style={styles.breakdownIcon} />
              <View style={styles.breakdownText}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  LOCAL TRANSIT
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  {activeBudget.transport}
                </CustomText>
              </View>
            </View>

            <View style={styles.breakdownRow}>
              <Ionicons name="map-outline" size={14} color={colors.textSecondary} style={styles.breakdownIcon} />
              <View style={styles.breakdownText}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  ACTIVITIES
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  {activeBudget.activities}
                </CustomText>
              </View>
            </View>
          </View>
        </GlassCard>
      </View>
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
  weatherCard: {
    padding: 16,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flex: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 14,
  },
  weatherGrid: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridIcon: {
    marginRight: 8,
  },
  tierRow: {
    flexDirection: 'row',
    padding: 3,
    width: '100%',
  },
  tierBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetCard: {
    padding: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyPrice: {
    marginTop: 2,
  },
  budgetBreakdown: {
    width: '100%',
    gap: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownIcon: {
    marginRight: 12,
  },
  breakdownText: {
    flex: 1,
  },
});
