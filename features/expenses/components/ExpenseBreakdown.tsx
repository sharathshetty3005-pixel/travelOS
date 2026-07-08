import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { ExpenseItem } from '@/mocks/trips';

interface ExpenseBreakdownProps {
  expensesList: ExpenseItem[];
}

const CATEGORY_METADATA = {
  Lodging: { icon: 'bed-outline', color: '#ffb900' },
  Transport: { icon: 'airplane-outline', color: '#00f2fe' },
  Dining: { icon: 'restaurant-outline', color: '#ff4d4d' },
  Activities: { icon: 'walk-outline', color: '#34c759' },
  Other: { icon: 'wallet-outline', color: '#a0a0a0' },
};

export const ExpenseBreakdown = React.memo(function ExpenseBreakdown({
  expensesList,
}: ExpenseBreakdownProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  // Sum spending per category
  const categories = ['Lodging', 'Transport', 'Dining', 'Activities', 'Other'] as const;
  const totalSpent = expensesList.reduce((sum, item) => sum + item.amount, 0);

  const categoryCosts = categories.reduce((acc, cat) => {
    acc[cat] = expensesList
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.titleText}>
        SPENDING BREAKDOWN
      </CustomText>

      <View style={[styles.list, { gap: spacing.small }]}>
        {categories.map((cat) => {
          const cost = categoryCosts[cat] || 0;
          const meta = CATEGORY_METADATA[cat];
          const percentage = totalSpent > 0 ? Math.round((cost / totalSpent) * 100) : 0;

          return (
            <View key={cat} style={styles.categoryRow}>
              {/* Left Details */}
              <View style={styles.leftLabelCol}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radii.s }]}>
                  <Ionicons name={meta.icon as any} size={13} color={colors.accentGold} />
                </View>
                <CustomText variant="caption" weight="600" color={colors.textPrimary} style={{ marginLeft: 8 }}>
                  {cat}
                </CustomText>
              </View>

              {/* Progress visual bar */}
              <View style={styles.trackCol}>
                <View style={[styles.track, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.capsule }]}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${percentage}%`,
                        backgroundColor: meta.color,
                        borderRadius: radii.capsule,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Right cost labels */}
              <View style={styles.rightCostCol}>
                <CustomText variant="caption" weight="700" color={colors.textPrimary}>
                  ${cost.toFixed(0)}
                </CustomText>
                <CustomText variant="caption" color={colors.textSecondary} style={{ fontSize: 9, marginLeft: 4 }}>
                  ({percentage}%)
                </CustomText>
              </View>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  titleText: {
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  list: {
    width: '100%',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leftLabelCol: {
    width: 85,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  track: {
    height: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  rightCostCol: {
    width: 65,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
});
