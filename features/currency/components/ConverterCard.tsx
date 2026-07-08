import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TextField } from '@/components/input/TextField';

interface ConverterCardProps {
  exchangeRates: Record<string, number>;
}

const CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'AUD'];

export const ConverterCard = React.memo(function ConverterCard({
  exchangeRates,
}: ConverterCardProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  const [amountStr, setAmountStr] = useState('100');
  const [sourceCur, setSourceCur] = useState('USD');
  const [targetCur, setTargetCur] = useState('EUR');
  const [result, setResult] = useState(0);

  useEffect(() => {
    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) {
      setResult(0);
      return;
    }

    const sourceRate = exchangeRates[sourceCur] || 1;
    const targetRate = exchangeRates[targetCur] || 1;

    // Convert: Amount in USD = val / sourceRate
    // Amount in Target = (val / sourceRate) * targetRate
    const converted = (val / sourceRate) * targetRate;
    setResult(converted);
  }, [amountStr, sourceCur, targetCur, exchangeRates]);

  const handleCurrencySelect = (type: 'source' | 'target', code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (type === 'source') {
      setSourceCur(code);
    } else {
      setTargetCur(code);
    }
  };

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      <CustomText variant="caption" weight="700" color={colors.accentGold}>
        CONVERTER UTILITY
      </CustomText>

      <View style={{ marginTop: spacing.medium }}>
        {/* Source input */}
        <TextField
          label={`Source Amount (${sourceCur})`}
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="decimal-pad"
          prefixIcon="calculator-outline"
        />

        {/* Source currency selector */}
        <CustomText variant="caption" color={colors.textSecondary} style={styles.selectorLabel}>
          CONVERT FROM
        </CustomText>
        <View style={styles.grid}>
          {CURRENCIES.map((code) => {
            const isSelected = sourceCur === code;
            return (
              <Pressable
                key={`src-${code}`}
                onPress={() => handleCurrencySelect('source', code)}
                style={[
                  styles.btn,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                    borderRadius: radii.s,
                  },
                ]}
              >
                <CustomText variant="caption" weight="700" color={isSelected ? colors.accentGold : colors.textSecondary}>
                  {code}
                </CustomText>
              </Pressable>
            );
          })}
        </View>

        {/* Target currency selector */}
        <CustomText variant="caption" color={colors.textSecondary} style={[styles.selectorLabel, { marginTop: spacing.small }]}>
          CONVERT TO
        </CustomText>
        <View style={styles.grid}>
          {CURRENCIES.map((code) => {
            const isSelected = targetCur === code;
            return (
              <Pressable
                key={`tgt-${code}`}
                onPress={() => handleCurrencySelect('target', code)}
                style={[
                  styles.btn,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                    borderRadius: radii.s,
                  },
                ]}
              >
                <CustomText variant="caption" weight="700" color={isSelected ? colors.accentGold : colors.textSecondary}>
                  {code}
                </CustomText>
              </Pressable>
            );
          })}
        </View>

        {/* Dynamic Display Panel */}
        <View style={[styles.resultPanel, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.m }]}>
          <CustomText variant="caption" color={colors.textSecondary}>
            CONVERTED ESTIMATION
          </CustomText>
          <CustomText variant="heading" weight="700" color={colors.textPrimary} style={{ marginTop: 4 }}>
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {targetCur}
          </CustomText>
        </View>
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  selectorLabel: {
    marginBottom: 6,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  resultPanel: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
