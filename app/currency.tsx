import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { ConverterCard } from '@/features/currency/components/ConverterCard';
import { RatesBoard } from '@/features/currency/components/RatesBoard';
import { AICurrencyBrief } from '@/features/currency/components/AICurrencyBrief';

const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  JPY: 161.40,
  GBP: 0.78,
  AUD: 1.48,
};

export default function CurrencyScreen() {
  const { colors, spacing, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Dynamic Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back to previous screen"
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="body" weight="700" color={colors.textPrimary}>
          CURRENCY CONVERTER
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal: spacing.xlarge,
            paddingTop: spacing.medium,
            paddingBottom: Math.max(insets.bottom, 24),
            gap: spacing.medium,
          },
        ]}
      >
        {/* Real-time Converter card */}
        <ConverterCard exchangeRates={EXCHANGE_RATES} />

        {/* Live Rates board grid */}
        <RatesBoard exchangeRates={EXCHANGE_RATES} />

        {/* AI local currency tips */}
        <AICurrencyBrief />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
