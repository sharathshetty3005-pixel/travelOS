import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, SlideOutLeft, Layout } from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';

// Component Imports
import { ExpenseSummary } from '@/features/expenses/components/ExpenseSummary';
import { ExpenseBreakdown } from '@/features/expenses/components/ExpenseBreakdown';
import { AddExpenseForm } from '@/features/expenses/components/AddExpenseForm';

// State Imports
import { useTripStore } from '@/store/tripStore';
import { ExpenseItem } from '@/mocks/trips';

const CATEGORY_ICONS = {
  Lodging: 'bed-outline',
  Transport: 'airplane-outline',
  Dining: 'restaurant-outline',
  Activities: 'walk-outline',
  Other: 'wallet-outline',
};

export default function ExpensesScreen() {
  const { colors, spacing, radii, isDark, shadow } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeTrip = useTripStore((state) =>
    state.trips.find((t) => t.status === 'active')
  );
  
  const addExpenseItem = useTripStore((state) => state.addExpenseItem);
  const deleteExpenseItem = useTripStore((state) => state.deleteExpenseItem);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  const handleLogExpense = (data: {
    description: string;
    amount: number;
    category: 'Lodging' | 'Transport' | 'Dining' | 'Activities' | 'Other';
  }) => {
    if (!activeTrip) return;

    const newExpense: ExpenseItem = {
      id: `exp-gen-${Date.now()}`,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: new Date().toISOString().split('T')[0],
    };

    addExpenseItem(activeTrip.id, newExpense);
  };

  const handleDeleteExpense = (itemId: string) => {
    if (!activeTrip) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    deleteExpenseItem(activeTrip.id, itemId);
  };

  if (!activeTrip) {
    return (
      <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <GlassCard style={styles.errorCard}>
          <Ionicons name="cash-outline" size={40} color={colors.accentGold} />
          <CustomText variant="body" weight="600" color={colors.textPrimary} style={{ marginTop: 12 }}>
            No Active Ledger Found
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.errorSubtitle}>
            Activate a trip from your Home dashboard or generate an itinerary to begin logging expenses.
          </CustomText>
          <Pressable
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}
          >
            <CustomText variant="caption" weight="700" color="#000000">
              GO BACK
            </CustomText>
          </Pressable>
        </GlassCard>
      </View>
    );
  }

  const list = activeTrip.expenseList || [];

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Navigation Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, borderBottomWidth: 0.5, paddingHorizontal: spacing.xlarge }]}>
        <Pressable onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="title" weight="600" color={colors.textPrimary}>
          Travel Ledger
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.xlarge, paddingBottom: insets.bottom + 48 }]}
      >
        {/* Budget summary circular ring card */}
        <View style={{ marginTop: spacing.medium }}>
          <ExpenseSummary trip={activeTrip} />
        </View>

        {/* Categorized Visual progress breakdown logs */}
        <View style={{ marginTop: spacing.medium }}>
          <ExpenseBreakdown expensesList={list} />
        </View>

        {/* Form to log new transaction */}
        <View style={{ marginTop: spacing.medium }}>
          <AddExpenseForm onLog={handleLogExpense} />
        </View>

        {/* Spend history list */}
        <View style={[styles.listHeader, { marginTop: spacing.large }]}>
          <CustomText variant="caption" weight="700" color={colors.accentGold}>
            TRANSACTION HISTORY
          </CustomText>
        </View>

        {list.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={24} color={colors.textSecondary} />
            <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 6 }}>
              No transactions recorded yet. Use the form above to add items.
            </CustomText>
          </GlassCard>
        ) : (
          <View style={styles.ledgerGrid}>
            {list.map((item) => {
              const iconName = CATEGORY_ICONS[item.category];
              return (
                <Animated.View
                  key={item.id}
                  entering={FadeIn}
                  exiting={SlideOutLeft}
                  layout={Layout.springify()}
                >
                  <GlassCard style={[styles.rowItem, shadow.sm]}>
                    <View style={styles.rowLeft}>
                      <View style={[styles.iconWrapper, { backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: radii.s }]}>
                        <Ionicons name={iconName as any} size={14} color={colors.accentGold} />
                      </View>
                      
                      <View style={styles.rowDetails}>
                        <CustomText variant="label" weight="600" color="#FFFFFF">
                          {item.description}
                        </CustomText>
                        <CustomText variant="caption" color={colors.textSecondary}>
                          {item.category} • {item.date}
                        </CustomText>
                      </View>
                    </View>

                    <View style={styles.rowRight}>
                      <CustomText variant="label" weight="700" color={colors.accentGold}>
                        -${item.amount.toFixed(2)}
                      </CustomText>
                      
                      <Pressable onPress={() => handleDeleteExpense(item.id)} style={styles.trashBtn}>
                        <Ionicons name="trash-outline" size={13} color={colors.error} />
                      </Pressable>
                    </View>
                  </GlassCard>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBack: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: 16,
  },
  listHeader: {
    marginBottom: 10,
    width: '100%',
  },
  ledgerGrid: {
    width: '100%',
    gap: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowDetails: {
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashBtn: {
    padding: 8,
    marginLeft: 8,
  },
  errorCard: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  errorSubtitle: {
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
});
