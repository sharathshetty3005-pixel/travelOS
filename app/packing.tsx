import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';

// Component Imports
import { PackingHero } from '@/features/packing/components/PackingHero';
import { LuggageCapacity } from '@/features/packing/components/LuggageCapacity';
import { TravelInsights } from '@/features/packing/components/TravelInsights';
import { AIAssistant } from '@/features/packing/components/AIAssistant';
import { ChecklistGroup } from '@/features/packing/components/ChecklistGroup';

// State Imports
import { useTripStore } from '@/store/tripStore';
import { PackingItem } from '@/mocks/trips';

const CATEGORIES: PackingItem['category'][] = [
  'Documents',
  'Essentials',
  'Clothing',
  'Electronics',
  'Toiletries',
];

export default function PackingScreen() {
  const { colors, spacing, radii, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Retrieve active trip from store
  const activeTrip = useTripStore((state) =>
    state.trips.find((t) => t.status === 'active')
  );

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  // Fallback state if no active trip exists
  if (!activeTrip) {
    return (
      <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <GlassCard style={styles.errorCard}>
          <Ionicons name="compass-outline" size={40} color={colors.accentGold} />
          <CustomText variant="body" weight="600" color={colors.textPrimary} style={{ marginTop: 12 }}>
            No Active Trip Planned
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.errorSubtitle}>
            Activate a trip from your Home dashboard or generate an itinerary to begin packing.
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

  const list = activeTrip.packingList || [];
  const isFinished = activeTrip.packingProgress === 100;

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Navigation Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, borderBottomWidth: 0.5, paddingHorizontal: spacing.xlarge }]}>
        <Pressable onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="title" weight="600" color={colors.textPrimary}>
          Packing Companion
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.xlarge, paddingBottom: insets.bottom + 48 }]}
      >
        {/* Celebration Banner when 100% packed */}
        {isFinished && (
          <GlassCard style={[styles.celebrationCard, { borderColor: colors.success }]}>
            <Ionicons name="checkmark-done-circle" size={22} color={colors.success} />
            <View style={styles.celebrationMeta}>
              <CustomText variant="label" weight="700" color={colors.success}>
                YOU'RE READY TO TRAVEL! 🎉
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                Carry-on zipped, check-in cleared, and documents secure. Safe travels!
              </CustomText>
            </View>
          </GlassCard>
        )}

        {/* Progress circular indicator card */}
        <View style={{ marginTop: spacing.medium }}>
          <PackingHero trip={activeTrip} />
        </View>

        {/* Volumetric luggage weight gauge */}
        <View style={{ marginTop: spacing.medium }}>
          <LuggageCapacity items={list} />
        </View>

        {/* Dynamic AI recommendations assistant */}
        <View style={{ marginTop: spacing.medium }}>
          <AIAssistant tripId={activeTrip.id} destinationId={activeTrip.destinationId} />
        </View>

        {/* Travel power outlets & adapter insights */}
        <View style={{ marginTop: spacing.medium }}>
          <TravelInsights trip={activeTrip} />
        </View>

        {/* Packing categories divider list */}
        <View style={[styles.listHeader, { marginTop: spacing.large }]}>
          <CustomText variant="caption" weight="700" color={colors.accentGold}>
            PACKING CHECKLIST
          </CustomText>
        </View>

        <View style={[styles.checklistGrid, { gap: spacing.small }]}>
          {CATEGORIES.map((cat) => {
            const catItems = list.filter((item) => item.category === cat);
            return (
              <ChecklistGroup
                key={cat}
                tripId={activeTrip.id}
                category={cat}
                items={catItems}
              />
            );
          })}
        </View>
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
  celebrationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(52, 199, 89, 0.05)',
  },
  celebrationMeta: {
    flex: 1,
    marginLeft: 12,
  },
  listHeader: {
    marginBottom: 10,
    width: '100%',
  },
  checklistGrid: {
    width: '100%',
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
});
