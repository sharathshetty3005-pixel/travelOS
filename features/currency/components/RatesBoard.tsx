import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';

interface RatesBoardProps {
  exchangeRates: Record<string, number>;
}

const BOARD_ITEMS = [
  { code: 'EUR', label: 'Euro Area', icon: 'logo-euro', trend: '+0.12%' },
  { code: 'JPY', label: 'Japanese Yen', icon: 'logo-yen', trend: '-0.34%' },
  { code: 'GBP', label: 'British Pound', icon: 'logo-pound', trend: '+0.05%' },
  { code: 'AUD', label: 'Australian Dollar', icon: 'cash-outline', trend: '+0.21%' },
];

export const RatesBoard = React.memo(function RatesBoard({
  exchangeRates,
}: RatesBoardProps) {
  const { colors, spacing, shadow } = useAppTheme();

  return (
    <View style={styles.container}>
      <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.sectionTitle}>
        LIVE RATES BOARD (vs USD)
      </CustomText>

      <View style={styles.grid}>
        {BOARD_ITEMS.map((item) => {
          const rate = exchangeRates[item.code] || 1;
          const isUp = item.trend.startsWith('+');

          return (
            <GlassCard key={item.code} style={[styles.panel, shadow.sm]}>
              <View style={styles.header}>
                <Ionicons name={item.icon as any} size={14} color={colors.accentGold} />
                <View style={[styles.trendBadge, { backgroundColor: isUp ? 'rgba(46,125,50,0.1)' : 'rgba(198,40,40,0.1)' }]}>
                  <CustomText variant="caption" weight="700" color={isUp ? colors.success : colors.error} style={{ fontSize: 8 }}>
                    {item.trend}
                  </CustomText>
                </View>
              </View>

              <View style={{ marginTop: 8 }}>
                <CustomText variant="heading" weight="700" color={colors.textPrimary}>
                  {rate.toFixed(2)}
                </CustomText>
                <CustomText variant="caption" color={colors.textSecondary} style={styles.symbolLabel}>
                  1 USD = {item.code}
                </CustomText>
                <CustomText variant="caption" color={colors.textSecondary} style={{ fontSize: 8 }}>
                  {item.label}
                </CustomText>
              </View>
            </GlassCard>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionTitle: {
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  panel: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: 12,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  symbolLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});
