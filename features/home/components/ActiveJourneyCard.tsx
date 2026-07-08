import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { ProgressRing } from '@/components/feedback/ProgressRing';
import { TripEntity } from '@/mocks/trips';

interface ActiveJourneyCardProps {
  trip: TripEntity | null;
}

export const ActiveJourneyCard = React.memo(function ActiveJourneyCard({
  trip,
}: ActiveJourneyCardProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();
  const router = useRouter();

  if (!trip) {
    return (
      <GlassCard style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }, styles.floatingMargin]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="compass-outline" size={28} color={colors.accentGold} />
          <CustomText variant="body" weight="500" color={colors.textPrimary} style={styles.emptyTitle}>
            Ready for your next retreat?
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.emptySubtitle}>
            Tap explore below to discover curations or plan a custom itinerary.
          </CustomText>
        </View>
      </GlassCard>
    );
  }

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    // Direct routing to dynamic trip details screen
    router.push(`/destination/${trip.destinationId}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        styles.floatingMargin,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${trip.title}`}
    >
      <GlassCard style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }, shadow.md]}>
        {/* Top summary row */}
        <View style={styles.header}>
          <View>
            <CustomText variant="caption" weight="700" color={colors.accentGold}>
              ACTIVE PASS
            </CustomText>
            <CustomText variant="title" weight="700" color={colors.textPrimary} style={styles.destinationTitle}>
              {trip.title}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              {trip.location}
            </CustomText>
          </View>
          
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              router.push('/packing');
            }}
          >
            <ProgressRing percentage={trip.packingProgress} size={48} strokeWidth={4} />
          </Pressable>
        </View>

        {/* Divider line */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Flight details board */}
        {trip.flight && (
          <View style={styles.infoRow}>
            <Ionicons name="airplane-outline" size={16} color={colors.accentGold} style={styles.icon} />
            <View style={styles.infoText}>
              <CustomText variant="label" weight="600" color={colors.textPrimary}>
                {trip.flight.airline} • {trip.flight.flightNumber}
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary}>
                Gate {trip.flight.gate} • Seat {trip.flight.seat} • Departs {trip.flight.departureTime}
              </CustomText>
            </View>
          </View>
        )}

        {/* Hotel details board */}
        {trip.hotel && (
          <View style={[styles.infoRow, { marginTop: spacing.small }]}>
            <Ionicons name="bed-outline" size={16} color={colors.accentGold} style={styles.icon} />
            <View style={styles.infoText}>
              <CustomText variant="label" weight="600" color={colors.textPrimary}>
                {trip.hotel.name}
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary}>
                Room: {trip.hotel.roomType} • Confirm: {trip.hotel.confirmationCode}
              </CustomText>
            </View>
          </View>
        )}

        {/* Divider line */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Bottom checklist details */}
        <View style={styles.footerRow}>
          <View style={styles.footerItem}>
            <CustomText variant="caption" color={colors.textSecondary}>
              DOCUMENTS
            </CustomText>
            <View style={styles.checkIconRow}>
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={trip.documentStatus.passportValid ? colors.success : colors.error}
              />
              <CustomText variant="caption" weight="600" color={colors.textPrimary} style={styles.checkText}>
                Passport Valid
              </CustomText>
            </View>
          </View>

          <View style={styles.footerItem}>
            <CustomText variant="caption" color={colors.textSecondary}>
              BUDGET SPENT
            </CustomText>
            <CustomText variant="caption" weight="600" color={colors.textPrimary} style={{ marginTop: 2 }}>
              ${trip.expenses.totalSpentUSD.toLocaleString()} / ${trip.expenses.budgetUSD.toLocaleString()}
            </CustomText>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  floatingMargin: {
    marginTop: -80, // Hangs over the bottom edge of Hero cover
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  card: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.70)', // fallback for web, dynamically overridden below
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destinationTitle: {
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flex: 1,
  },
  checkIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  checkText: {
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    marginTop: 10,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 4,
    width: '80%',
    lineHeight: 18,
  },
});
