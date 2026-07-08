import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { useTripStore } from '@/store/tripStore';

const GET_TIPS_BY_DESTINATION = (id: string): string[] => {
  switch (id) {
    case 'trip-positano':
    case 'dest-positano':
      return [
        'Euros are cash-king for small restaurants and beach loungers.',
        'Dining tables usually include a Coperto cover fee. Separate tipping is not required but rounded change (+5-10%) is highly polite.',
        'Beware of tourist exchange booths near Amalfi docks; ATMs at local banks offer better conversion rates.',
      ];
    case 'dest-kyoto':
      return [
        'Japanese Yen is cash-heavy. Carry a small coin pouch for bus tickets, vending machines, and local street stalls.',
        'Tipping is strictly discouraged and can cause confusion or embarrassment. Excellent service is fully covered.',
        'ATM cash withdrawals at local convenience stores (7-Eleven) are the cheapest conversion method.',
      ];
    default:
      return [
        'Credit cards are accepted globally for transport and hotels. Keep a small reserve of local currency for taxis.',
        'Standard tipping margins are around 10% in sit-down restaurants unless a service charge is already added.',
        'Ensure travel alert notices are active on your home credit cards to avoid biometric security locks.',
      ];
  }
};

export const AICurrencyBrief = React.memo(function AICurrencyBrief() {
  const { colors, spacing, shadow } = useAppTheme();
  const trips = useTripStore((state) => state.trips);
  const activeTrip = trips[0]; // Active Positano trip

  const destId = activeTrip?.destinationId || 'dest-positano';
  const tips = GET_TIPS_BY_DESTINATION(destId);

  return (
    <GlassCard style={[styles.card, shadow.sm, { borderColor: colors.accentGold }]}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={colors.accentGold} />
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.title}>
          AI FINANCIAL INTELLIGENCE
        </CustomText>
      </View>

      <View style={styles.tipsList}>
        {tips.map((tip, idx) => (
          <View key={`tip-${idx}`} style={styles.tipRow}>
            <Ionicons name="ellipse" size={4} color={colors.accentGold} style={styles.bullet} />
            <CustomText variant="caption" color={colors.textPrimary} style={styles.tipText}>
              {tip}
            </CustomText>
          </View>
        ))}
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    marginLeft: 6,
    letterSpacing: 1.5,
  },
  tipsList: {
    width: '100%',
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  bullet: {
    marginTop: 6,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    lineHeight: 16,
  },
});
