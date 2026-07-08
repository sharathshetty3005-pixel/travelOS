import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';

interface PackingHeroProps {
  trip: TripEntity;
}

export const PackingHero = React.memo(function PackingHero({ trip }: PackingHeroProps) {
  const { colors, spacing, shadow } = useAppTheme();

  const list = trip.packingList || [];
  const totalItems = list.length;
  const packedItems = list.filter((i) => i.packed).length;
  const remainingItems = totalItems - packedItems;
  const progressPercent = trip.packingProgress;

  // Calculate Travel Readiness Score (weighted by high-priority items)
  const highPriorityItems = list.filter((i) => i.priority === 'high');
  const packedHighPriority = highPriorityItems.filter((i) => i.packed).length;
  const readinessScore =
    highPriorityItems.length > 0
      ? Math.round((packedHighPriority / highPriorityItems.length) * 100)
      : progressPercent;

  // Progress SVG Ring constants
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      {/* Left Column: Progress Ring Overlay */}
      <View style={styles.ringColumn}>
        <View style={styles.svgWrapper}>
          <Svg width={size} height={size}>
            {/* Background Ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.accentGold}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          {/* Inner metrics texts */}
          <View style={styles.innerValue}>
            <CustomText variant="heading" weight="700" color={colors.textPrimary}>
              {progressPercent}%
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              packed
            </CustomText>
          </View>
        </View>
      </View>

      {/* Right Column: Statistics lists */}
      <View style={styles.statsColumn}>
        <View style={styles.statSegment}>
          <CustomText variant="caption" color={colors.textSecondary}>
            READINESS SCORE
          </CustomText>
          <CustomText variant="title" weight="700" color={colors.accentGold}>
            {readinessScore}% Ready
          </CustomText>
        </View>

        <View style={styles.statSegment}>
          <CustomText variant="caption" color={colors.textSecondary}>
            COUNTDOWN
          </CustomText>
          <CustomText variant="body" weight="600" color={colors.textPrimary}>
            {trip.countdownDays} Days left
          </CustomText>
        </View>

        <View style={styles.countsRow}>
          <View style={styles.countBox}>
            <CustomText variant="heading" weight="700" color={colors.textPrimary}>
              {packedItems}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              packed
            </CustomText>
          </View>
          <View style={styles.countBox}>
            <CustomText variant="heading" weight="700" color={colors.textPrimary}>
              {remainingItems}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              left
            </CustomText>
          </View>
        </View>
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 0.5,
  },
  ringColumn: {
    marginRight: 20,
  },
  svgWrapper: {
    width: 140,
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerValue: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  statSegment: {
    width: '100%',
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  countBox: {
    flex: 1,
  },
});
