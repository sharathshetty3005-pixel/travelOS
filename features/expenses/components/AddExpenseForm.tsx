import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TextField } from '@/components/input/TextField';
import { Button } from '@/components/input/Button';

interface AddExpenseFormProps {
  onLog: (data: {
    description: string;
    amount: number;
    category: 'Lodging' | 'Transport' | 'Dining' | 'Activities' | 'Other';
  }) => void;
}

const CATEGORIES = ['Lodging', 'Transport', 'Dining', 'Activities', 'Other'] as const;

export const AddExpenseForm = React.memo(function AddExpenseForm({
  onLog,
}: AddExpenseFormProps) {
  const { colors, spacing, radii } = useAppTheme();

  const [desc, setDesc] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<'Lodging' | 'Transport' | 'Dining' | 'Activities' | 'Other'>('Dining');
  
  const [errorDesc, setErrorDesc] = useState('');
  const [errorAmount, setErrorAmount] = useState('');

  const handleSubmit = () => {
    let hasError = false;
    setErrorDesc('');
    setErrorAmount('');

    if (!desc.trim()) {
      setErrorDesc('Description is required');
      hasError = true;
    }

    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) {
      setErrorAmount('Enter a valid amount');
      hasError = true;
    }

    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    
    onLog({
      description: desc.trim(),
      amount: val,
      category,
    });

    // Reset inputs
    setDesc('');
    setAmountStr('');
  };

  return (
    <GlassCard style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <CustomText variant="caption" weight="700" color={colors.accentGold}>
        LOG NEW TRANSACTION
      </CustomText>
      
      <View style={{ marginTop: spacing.medium }}>
        <TextField
          label="Item Description"
          value={desc}
          onChangeText={setDesc}
          error={errorDesc}
          prefixIcon="cart-outline"
        />

        <TextField
          label="Amount Spent (USD)"
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="decimal-pad"
          error={errorAmount}
          prefixIcon="cash-outline"
        />

        {/* Category horizontal selection cards */}
        <CustomText variant="caption" color={colors.textSecondary} style={styles.catLabel}>
          EXPENSE CATEGORY
        </CustomText>
        <View style={styles.catRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setCategory(cat);
                }}
                style={[
                  styles.catBtn,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected
                      ? 'rgba(212,175,55,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    borderRadius: radii.s,
                  },
                ]}
              >
                <CustomText
                  variant="caption"
                  weight="600"
                  color={isSelected ? colors.accentGold : colors.textSecondary}
                  style={{ fontSize: 10 }}
                >
                  {cat}
                </CustomText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ marginTop: spacing.medium }}>
        <Button label="LOG EXPENDITURE" onPress={handleSubmit} />
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  catLabel: {
    marginBottom: 8,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  catBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
