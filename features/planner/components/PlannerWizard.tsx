import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { Button } from '@/components/input/Button';
import { mockDestinations } from '@/mocks/destinations';

export interface WizardData {
  destinationId: string;
  durationDays: number;
  style: 'Backpacker' | 'Comfort' | 'Luxury';
  interests: string[];
}

interface PlannerWizardProps {
  initialDestinationId?: string;
  onGenerate: (data: WizardData) => void;
}

const INTEREST_OPTIONS = [
  { id: 'int-nature', label: 'Nature & Parks', icon: 'leaf-outline' },
  { id: 'int-culinary', label: 'Food & Dining', icon: 'restaurant-outline' },
  { id: 'int-culture', label: 'History & Culture', icon: 'library-outline' },
  { id: 'int-adventure', label: 'Adventure Sports', icon: 'bonfire-outline' },
  { id: 'int-relax', label: 'Relaxation & Spa', icon: 'sunny-outline' },
];

export const PlannerWizard = React.memo(function PlannerWizard({
  initialDestinationId,
  onGenerate,
}: PlannerWizardProps) {
  const { colors, spacing, radii, isDark } = useAppTheme();

  // Wizard state hooks
  const [selectedDestId, setSelectedDestId] = useState(
    initialDestinationId || mockDestinations[0].id
  );
  const [duration, setDuration] = useState(4);
  const [travelStyle, setTravelStyle] = useState<'Backpacker' | 'Comfort' | 'Luxury'>('Comfort');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['int-nature', 'int-culture']);

  const handleInterestToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStyleSelect = (style: 'Backpacker' | 'Comfort' | 'Luxury') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setTravelStyle(style);
  };

  const handleDurationChange = (change: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDuration((prev) => Math.min(Math.max(prev + change, 1), 7));
  };

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onGenerate({
      destinationId: selectedDestId,
      durationDays: duration,
      style: travelStyle,
      interests: selectedInterests,
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* 1. Destination Card Selection */}
      <GlassCard style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          STEP 1
        </CustomText>
        <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.sectionTitle}>
          Choose Your Retreat
        </CustomText>
        
        <View style={styles.destinationList}>
          {mockDestinations.map((dest) => {
            const isSelected = selectedDestId === dest.id;
            return (
              <Pressable
                key={dest.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setSelectedDestId(dest.id);
                }}
                style={[
                  styles.destItem,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected
                      ? 'rgba(212, 175, 55, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: radii.m,
                  },
                ]}
              >
                <View style={styles.destMeta}>
                  <CustomText variant="label" weight="600" color={colors.textPrimary}>
                    {dest.title}
                  </CustomText>
                  <CustomText variant="caption" color={colors.textSecondary}>
                    {dest.country}
                  </CustomText>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.accentGold} />
                )}
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      {/* 2. Duration Selector */}
      <GlassCard style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: spacing.medium }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          STEP 2
        </CustomText>
        <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.sectionTitle}>
          Trip Length
        </CustomText>
        
        <View style={styles.durationRow}>
          <Pressable
            onPress={() => handleDurationChange(-1)}
            style={[styles.countBtn, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.s }]}
          >
            <Ionicons name="remove" size={18} color={colors.textPrimary} />
          </Pressable>
          
          <View style={styles.durationValueBox}>
            <CustomText variant="title" weight="700" color={colors.textPrimary}>
              {duration}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              {duration === 1 ? 'day' : 'days'}
            </CustomText>
          </View>
          
          <Pressable
            onPress={() => handleDurationChange(1)}
            style={[styles.countBtn, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.s }]}
          >
            <Ionicons name="add" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>
      </GlassCard>

      {/* 3. Style Selection */}
      <GlassCard style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: spacing.medium }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          STEP 3
        </CustomText>
        <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.sectionTitle}>
          Travel Style
        </CustomText>
        
        <View style={[styles.styleRow, { gap: spacing.tiny }]}>
          {(['Backpacker', 'Comfort', 'Luxury'] as const).map((styleOption) => {
            const isSelected = travelStyle === styleOption;
            return (
              <Pressable
                key={styleOption}
                onPress={() => handleStyleSelect(styleOption)}
                style={[
                  styles.styleBtn,
                  {
                    flex: 1,
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected
                      ? 'rgba(212, 175, 55, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: radii.s,
                  },
                ]}
              >
                <CustomText
                  variant="caption"
                  weight="600"
                  color={isSelected ? colors.accentGold : colors.textSecondary}
                >
                  {styleOption}
                </CustomText>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      {/* 4. Interests Selector */}
      <GlassCard style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: spacing.medium }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          STEP 4
        </CustomText>
        <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.sectionTitle}>
          Curated Interests
        </CustomText>
        
        <View style={styles.chipsGrid}>
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <Pressable
                key={interest.id}
                onPress={() => handleInterestToggle(interest.id)}
                style={[
                  styles.chip,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected
                      ? 'rgba(212, 175, 55, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: radii.capsule,
                  },
                ]}
              >
                <Ionicons
                  name={interest.icon as any}
                  size={12}
                  color={isSelected ? colors.accentGold : colors.textSecondary}
                />
                <CustomText
                  variant="caption"
                  weight="600"
                  color={isSelected ? colors.accentGold : colors.textSecondary}
                  style={styles.chipText}
                >
                  {interest.label}
                </CustomText>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      {/* Submit Action */}
      <View style={{ marginTop: spacing.large, marginBottom: spacing.huge }}>
        <Button label="GENERATE AI ITINERARY" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionCard: {
    padding: 16,
    borderWidth: 0.5,
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  destinationList: {
    gap: 10,
  },
  destItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
  },
  destMeta: {
    flex: 1,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  countBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationValueBox: {
    alignItems: 'center',
    minWidth: 80,
  },
  styleRow: {
    flexDirection: 'row',
  },
  styleBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  chipText: {
    marginLeft: 6,
  },
});
