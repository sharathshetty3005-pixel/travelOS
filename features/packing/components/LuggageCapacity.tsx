import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { PackingItem } from '@/mocks/trips';

interface LuggageCapacityProps {
  items: PackingItem[];
}

export const LuggageCapacity = React.memo(function LuggageCapacity({
  items,
}: LuggageCapacityProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  // Compute volumetric space usage of packed items
  const MAX_CAPACITY = 80; // Total volumetric capacity units of standard carry-on
  
  const totalVolumeUsed = items
    .filter((item) => item.packed)
    .reduce((sum, item) => sum + item.quantity * item.spaceWeight, 0);

  const percentageUsed = Math.min(Math.round((totalVolumeUsed / MAX_CAPACITY) * 100), 100);

  const getCapacityAdvice = (pct: number) => {
    if (pct < 45) return 'Airy. Ample cabin space remains for local shopping.';
    if (pct < 80) return 'Optimal. Standard travel volume reached.';
    return 'Warning: Heavy load. Approaching carry-on weight limits.';
  };

  const adviceText = getCapacityAdvice(percentageUsed);

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="bag-handle-outline" size={14} color={colors.accentGold} />
          <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.titleText}>
            LUGGAGE VOLUME
          </CustomText>
        </View>
        <CustomText variant="caption" weight="600" color={colors.textPrimary}>
          {percentageUsed}% used
        </CustomText>
      </View>

      {/* Progress Track */}
      <View style={[styles.track, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.capsule }]}>
        <View
          style={[
            styles.bar,
            {
              width: `${percentageUsed}%`,
              backgroundColor: percentageUsed > 80 ? colors.error : colors.accentGold,
              borderRadius: radii.capsule,
            },
          ]}
        />
      </View>

      <CustomText variant="caption" color={colors.textSecondary} style={styles.advice}>
        {adviceText}
      </CustomText>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 6,
    letterSpacing: 1.5,
  },
  track: {
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  advice: {
    marginTop: 8,
    lineHeight: 16,
  },
});
