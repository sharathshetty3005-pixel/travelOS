import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';
import { useTripStore } from '@/store/tripStore';

interface ItineraryViewerProps {
  generatedTrip: TripEntity;
  onReset: () => void;
}

export const ItineraryViewer = React.memo(function ItineraryViewer({
  generatedTrip,
  onReset,
}: ItineraryViewerProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();
  const router = useRouter();
  const addTrip = useTripStore((state) => state.addTrip);

  const itineraryDays = (generatedTrip as any).itineraryDays || [];

  const handleLaunchTrip = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    
    // 1. Add generated trip to state store
    addTrip(generatedTrip);

    // 2. Route user back to dashboard home
    router.push('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.headerTitle}>
        AI ITINERARY GENERATED
      </CustomText>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
        {/* Curated Details summaries */}
        <GlassCard style={[styles.summaryCard, shadow.sm]}>
          <View style={styles.summaryRow}>
            <View style={styles.iconBox}>
              <Ionicons name="airplane-outline" size={16} color={colors.accentGold} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <CustomText variant="caption" color={colors.textSecondary}>
                ROUNDTRIP FLIGHT
              </CustomText>
              <CustomText variant="label" weight="600" color={colors.textPrimary}>
                {generatedTrip.flight?.airline} • {generatedTrip.flight?.flightNumber}
              </CustomText>
            </View>
          </View>

          <View style={[styles.summaryRow, { marginTop: 12 }]}>
            <View style={styles.iconBox}>
              <Ionicons name="bed-outline" size={16} color={colors.accentGold} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <CustomText variant="caption" color={colors.textSecondary}>
                HOTEL RESERVATION
              </CustomText>
              <CustomText variant="label" weight="600" color={colors.textPrimary}>
                {generatedTrip.hotel?.name}
              </CustomText>
            </View>
          </View>
        </GlassCard>

        {/* Timeline days */}
        {itineraryDays.map((dayText: string, index: number) => (
          <GlassCard key={`day-${index}`} style={[styles.dayCard, shadow.sm]}>
            <View style={styles.dayHeader}>
              <Ionicons name="calendar-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" weight="700" color={colors.accentGold} style={{ marginLeft: 6 }}>
                DAY {index + 1}
              </CustomText>
            </View>
            <CustomText variant="caption" color={colors.textPrimary} style={styles.dayBody}>
              {dayText}
            </CustomText>
          </GlassCard>
        ))}
      </ScrollView>

      {/* Launcher Buttons */}
      <View style={styles.btnRow}>
        <Pressable onPress={onReset} style={[styles.resetBtn, { borderColor: colors.border, borderRadius: radii.s }]}>
          <CustomText variant="caption" weight="700" color={colors.textSecondary}>
            RE-PLAN
          </CustomText>
        </Pressable>
        <Pressable onPress={handleLaunchTrip} style={[styles.launchBtn, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}>
          <CustomText variant="caption" weight="700" color="#000000">
            LAUNCH TRIP
          </CustomText>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerTitle: {
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  summaryCard: {
    padding: 14,
    borderWidth: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCard: {
    padding: 14,
    borderWidth: 0.5,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayBody: {
    lineHeight: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  resetBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  launchBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
