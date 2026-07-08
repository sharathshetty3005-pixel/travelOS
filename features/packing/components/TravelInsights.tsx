import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';

interface TravelInsightsProps {
  trip: TripEntity;
}

export const TravelInsights = React.memo(function TravelInsights({
  trip,
}: TravelInsightsProps) {
  const { colors, spacing, shadow } = useAppTheme();

  // Resolve adapter configurations based on destination
  const getPowerAdapter = (destId: string): string => {
    switch (destId) {
      case 'dest-amalfi':
        return 'Type L / C • 230V';
      case 'dest-kyoto':
        return 'Type A / B • 100V';
      case 'dest-reykjavik':
        return 'Type C / F • 230V';
      case 'dest-serengeti':
      default:
        return 'Type G • 240V';
    }
  };

  const adapter = getPowerAdapter(trip.destinationId);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Quadrant 1: Visa Status */}
        <GlassCard style={[styles.panel, shadow.sm]}>
          <View style={styles.header}>
            <Ionicons name="document-text-outline" size={14} color={colors.accentGold} />
            <CustomText variant="caption" color={colors.textSecondary} style={styles.title}>
              VISA & PASSPORT
            </CustomText>
          </View>
          <CustomText variant="caption" weight="600" color={colors.textPrimary} style={styles.value}>
            Cleared for entry
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary}>
            Passport expires: 2031
          </CustomText>
        </GlassCard>

        {/* Quadrant 2: Baggage Limit */}
        <GlassCard style={[styles.panel, shadow.sm]}>
          <View style={styles.header}>
            <Ionicons name="airplane-outline" size={14} color={colors.accentGold} />
            <CustomText variant="caption" color={colors.textSecondary} style={styles.title}>
              BAGGAGE RULES
            </CustomText>
          </View>
          <CustomText variant="caption" weight="600" color={colors.textPrimary} style={styles.value}>
            Cabin: 8kg max
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary}>
            Checked: 1 x 23kg limit
          </CustomText>
        </GlassCard>
      </View>

      <View style={[styles.row, { marginTop: spacing.small }]}>
        {/* Quadrant 3: Adapter socket info */}
        <GlassCard style={[styles.panel, shadow.sm]}>
          <View style={styles.header}>
            <Ionicons name="flash-outline" size={14} color={colors.accentGold} />
            <CustomText variant="caption" color={colors.textSecondary} style={styles.title}>
              POWER OUTLET
            </CustomText>
          </View>
          <CustomText variant="caption" weight="600" color={colors.textPrimary} style={styles.value}>
            {adapter}
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary}>
            Adapter Required
          </CustomText>
        </GlassCard>

        {/* Quadrant 4: Weather briefs */}
        <GlassCard style={[styles.panel, shadow.sm]}>
          <View style={styles.header}>
            <Ionicons name="sunny-outline" size={14} color={colors.accentGold} />
            <CustomText variant="caption" color={colors.textSecondary} style={styles.title}>
              WEATHER OUTLOOK
            </CustomText>
          </View>
          <CustomText variant="caption" weight="600" color={colors.textPrimary} style={styles.value}>
            Day 2 Rain forecast
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary}>
            Temp avg: 24°C
          </CustomText>
        </GlassCard>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  panel: {
    flex: 1,
    padding: 12,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    marginLeft: 6,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  value: {
    marginVertical: 2,
  },
});
