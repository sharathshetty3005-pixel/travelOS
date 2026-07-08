import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';

interface ContinuePlanningProps {
  trip: TripEntity | null;
}

export const ContinuePlanning = React.memo(function ContinuePlanning({
  trip,
}: ContinuePlanningProps) {
  const { colors, spacing, radii } = useAppTheme();
  const router = useRouter();

  if (!trip) return null; // Only render if there's a draft/upcoming trip

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push({ pathname: '/planner', params: { destId: trip.destinationId } } as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Resume planning for ${trip.title}`}
      style={({ pressed }) => [
        styles.root,
        pressed && styles.pressed,
      ]}
    >
      <GlassCard style={styles.card}>
        <View style={styles.contentRow}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: radii.m }]}>
            <Ionicons name="create-outline" size={20} color={colors.accentGold} />
          </View>

          <View style={styles.infoWrapper}>
            <CustomText variant="caption" weight="700" color={colors.textSecondary}>
              CONTINUE PLANNING
            </CustomText>
            <CustomText variant="label" weight="600" color={colors.textPrimary} style={styles.tripTitle}>
              {trip.title}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              Itinerary: {trip.packingProgress}% complete • Departs in {trip.countdownDays} days
            </CustomText>
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.accentGold} />
        </View>
      </GlassCard>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  card: {
    padding: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
  },
  tripTitle: {
    marginTop: 2,
  },
});
