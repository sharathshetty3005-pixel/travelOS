import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';
import { PlannerWizard, WizardData } from '@/features/planner/components/PlannerWizard';
import { ItineraryViewer } from '@/features/planner/components/ItineraryViewer';

// Repository Imports
import { tripRepository } from '@/repositories/TripRepository';
import { destinationRepository } from '@/repositories/DestinationRepository';
import { TripEntity } from '@/mocks/trips';

type PlannerStage = 'wizard' | 'generating' | 'viewer';

const GENERATING_STEPS = [
  'Reading destination weather patterns...',
  'Curating top rated local dining spots...',
  'Mapping walking routes and schedules...',
  'Polishing travel ledger entries...',
];

export default function PlannerScreen() {
  const { destId } = useLocalSearchParams<{ destId: string }>();
  const { colors, spacing, radii } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Wizard and viewer stages
  const [stage, setStage] = useState<PlannerStage>('wizard');
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [generationStep, setGenerationStep] = useState(0);

  // Cycle simulated AI generation steps
  useEffect(() => {
    if (stage !== 'generating') return;

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= GENERATING_STEPS.length - 1) {
          clearInterval(interval);
          // Transition to itinerary viewer when finished
          setTimeout(() => {
            setStage('viewer');
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [stage]);

  const handleGenerate = (data: WizardData) => {
    setWizardData(data);
    setGenerationStep(0);
    setStage('generating');
  };

  const handleSave = async () => {
    if (!wizardData) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    try {
      // Resolve target destination details
      const dest = await destinationRepository.getDestinationDetails(wizardData.destinationId);
      const titleName = dest ? dest.title : 'Curated';
      const locName = dest ? `${dest.title}, ${dest.country}` : 'Custom';

      const budget = wizardData.style === 'Luxury' ? 6000 : wizardData.style === 'Comfort' ? 3000 : 1500;

      // Construct a new active trip entity
      const newTrip: TripEntity = {
        id: `trip-gen-${Date.now()}`,
        destinationId: wizardData.destinationId,
        title: `${titleName} Escape`,
        location: locName,
        startDate: '2026-08-10',
        endDate: '2026-08-14',
        status: 'active', // Forces instant home active dashboard updates
        countdownDays: 32,
        packingProgress: 0,
        totalPackedItems: 0,
        totalRequiredItems: 20,
        documentStatus: {
          passportValid: true,
          visaApproved: true,
          insuranceUploaded: false,
        },
        expenses: {
          totalSpentUSD: 0,
          budgetUSD: budget,
        },
      };

      await tripRepository.addTrip(newTrip);
      
      // Return user back to Home tabs
      router.push('/(tabs)');
    } catch (err) {
      // Silenced error boundary
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (stage === 'viewer') {
      setStage('wizard');
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Static header bar */}
      <View style={[styles.header, { borderBottomColor: colors.border, borderBottomWidth: 0.5, paddingHorizontal: spacing.xlarge }]}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="title" weight="600" color={colors.textPrimary}>
          {stage === 'viewer' ? 'AI Itinerary' : 'AI Trip Planner'}
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      {/* Substage dispatcher */}
      <View style={[styles.content, { paddingHorizontal: spacing.xlarge }]}>
        {stage === 'wizard' && (
          <PlannerWizard initialDestinationId={destId} onGenerate={handleGenerate} />
        )}

        {stage === 'generating' && (
          <View style={styles.generatingBox}>
            <GlassCard style={styles.generatingCard}>
              <ActivityIndicator size="large" color={colors.accentGold} />
              <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.generatingTitle}>
                Crafting Your Custom Path
              </CustomText>
              <CustomText variant="caption" color={colors.textSecondary} style={styles.generatingStepText}>
                {GENERATING_STEPS[generationStep]}
              </CustomText>
            </GlassCard>
          </View>
        )}

        {stage === 'viewer' && wizardData && (
          <ItineraryViewer wizardData={wizardData} onSave={handleSave} />
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  generatingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatingCard: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  generatingTitle: {
    marginTop: 16,
  },
  generatingStepText: {
    marginTop: 6,
    textAlign: 'center',
  },
});
