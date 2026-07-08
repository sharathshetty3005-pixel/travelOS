import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { PlannerWizard } from '@/features/planner/components/PlannerWizard';
import { ItineraryViewer } from '@/features/planner/components/ItineraryViewer';
import { TripEntity } from '@/mocks/trips';

export default function PlannerScreen() {
  const { colors, spacing, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [generatedTrip, setGeneratedTrip] = useState<TripEntity | null>(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (generatedTrip) {
      setGeneratedTrip(null);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top || 16, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="body" weight="700" color={colors.textPrimary}>
          {generatedTrip ? 'ITINERARY VIEWER' : 'AI TRIP PLANNER'}
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      <View style={[styles.content, { paddingHorizontal: spacing.xlarge, paddingVertical: spacing.medium }]}>
        {!generatedTrip ? (
          <PlannerWizard onCompleteGeneration={setGeneratedTrip} />
        ) : (
          <ItineraryViewer generatedTrip={generatedTrip} onReset={() => setGeneratedTrip(null)} />
        )}
      </View>
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
  content: {
    flex: 1,
  },
});
