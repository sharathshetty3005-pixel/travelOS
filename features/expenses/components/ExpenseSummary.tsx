import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';

interface ExpenseSummaryProps {
  trip: TripEntity;
}

export const ExpenseSummary = React.memo(function ExpenseSummary({ trip }: ExpenseSummaryProps) {
  const { colors, spacing, shadow } = useAppTheme();

  const budget = trip.expenses.budgetUSD;
  const spent = trip.expenses.totalSpentUSD;
  const remaining = Math.max(budget - spent, 0);
  
  const spentPercentage = Math.min(Math.round((spent / budget) * 100), 100);

  // SVG parameters
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (spentPercentage / 100) * circumference;

  const getBudgetAdvice = () => {
    if (spentPercentage > 85) return 'Alert: Critical budget threshold crossed. Minimize optional dining and activities.';
    if (spentPercentage > 50) return 'Notice: Over half of budget depleted. Align daily activities to balance logs.';
    return `Stable. Remaining allowance is approx. $${Math.round(remaining / 7)}/day over a 7-day span.`;
  };

  const adviceText = getBudgetAdvice();

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      {/* Left Progress Circle */}
      <View style={styles.ringColumn}>
        <View style={styles.svgWrapper}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={spentPercentage > 85 ? colors.error : colors.accentGold}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.innerValue}>
            <CustomText variant="heading" weight="700" color={colors.textPrimary}>
              {spentPercentage}%
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              spent
            </CustomText>
          </View>
        </View>
      </View>

      {/* Right Details */}
      <View style={styles.detailsColumn}>
        <View style={styles.segment}>
          <CustomText variant="caption" color={colors.textSecondary}>
            TOTAL EXPENDED
          </CustomText>
          <CustomText variant="title" weight="700" color={colors.textPrimary}>
            ${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CustomText>
        </View>

        <View style={styles.segment}>
          <CustomText variant="caption" color={colors.textSecondary}>
            REMAINING FUNDS
          </CustomText>
          <CustomText variant="body" weight="600" color={colors.accentGold}>
            ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CustomText>
        </View>

        <View style={styles.segment}>
          <CustomText variant="caption" color={colors.textSecondary}>
            TOTAL BUDGET LIMIT
          </CustomText>
          <CustomText variant="caption" weight="600" color={colors.textSecondary}>
            ${budget.toLocaleString()} USD
          </CustomText>
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
  detailsColumn: {
    flex: 1,
    gap: 10,
  },
  segment: {
    width: '100%',
  },
});
