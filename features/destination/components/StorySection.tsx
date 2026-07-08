import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { DestinationEntity } from '@/mocks/destinations';

interface StorySectionProps {
  destination: DestinationEntity;
}

export const StorySection = React.memo(function StorySection({
  destination,
}: StorySectionProps) {
  const { colors, spacing, radii } = useAppTheme();

  // Custom AI travel advice based on target destinations
  const getTravelTips = (destId: string): string[] => {
    switch (destId) {
      case 'dest-amalfi':
        return [
          'Visit franco’s bar before 6 PM to secure a sunset cliffside table.',
          'Rent a small scooter only if you are experienced; otherwise, use boat ferries to avoid tight coastal traffic jams.',
          'Pack comfortable walking sneakers; Positano villages require climbing hundreds of vertical stone steps.',
        ];
      case 'dest-kyoto':
        return [
          'Arrive at the Arashiyama bamboo forest by 6 AM to enjoy silent walking paths without crowds.',
          'Purchase a JR pass or local IC card for seamless transit across subway lines.',
          'Keep your trash with you; public bins are rare in Kyoto landmarks.',
        ];
      case 'dest-reykjavik':
        return [
          'Pre-book Blue Lagoon entrance tickets 2 months in advance to secure sunset windows.',
          'Pack a windproof, waterproof shell jacket; Icelandic weather shifts within minutes.',
          'Chasing northern lights is best from late September onwards.',
        ];
      case 'dest-serengeti':
        return [
          'Book safaris during the June-July Mara River crossings to witness the Great Migration.',
          'Consult your doctor for malaria prescriptions and yellow fever vaccinations beforehand.',
          'Bring a quality zoom lens (70-300mm) to capture wild predator snapshots safely.',
        ];
      default:
        return [
          'Secure bookings for local attractions 3 weeks in advance.',
          'Explore local markets early in the morning to beat the tourist rush.',
        ];
    }
  };

  const tips = getTravelTips(destination.id);

  return (
    <View style={styles.container}>
      {/* 1. Why You'll Love It */}
      <View style={[styles.section, { paddingHorizontal: spacing.xlarge }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          EDITORIAL OVERVIEW
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Why You’ll Love It
        </CustomText>
        <CustomText variant="body" color="rgba(255, 255, 255, 0.82)" style={styles.description}>
          {destination.description}
        </CustomText>
      </View>

      {/* 2. Local Insights Grid */}
      <View style={[styles.section, { paddingHorizontal: spacing.xlarge, marginTop: spacing.large }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          PRACTICAL KNOWLEDGE
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          Local Insights
        </CustomText>

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={[styles.gridItem, { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: colors.border, borderWidth: 0.5, borderRadius: radii.m }]}>
              <Ionicons name="cash-outline" size={18} color={colors.accentGold} />
              <View style={styles.itemTextWrapper}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  CURRENCY
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  {destination.currencyCode} (Cash & Cards)
                </CustomText>
              </View>
            </View>

            <View style={[styles.gridItem, { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: colors.border, borderWidth: 0.5, borderRadius: radii.m }]}>
              <Ionicons name="chatbox-ellipses-outline" size={18} color={colors.accentGold} />
              <View style={styles.itemTextWrapper}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  LANGUAGE
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  Local dialect is native
                </CustomText>
              </View>
            </View>
          </View>

          <View style={[styles.gridRow, { marginTop: spacing.small }]}>
            <View style={[styles.gridItem, { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: colors.border, borderWidth: 0.5, borderRadius: radii.m }]}>
              <Ionicons name="flash-outline" size={18} color={colors.accentGold} />
              <View style={styles.itemTextWrapper}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  VOLTAGE
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  230V / Type C plug
                </CustomText>
              </View>
            </View>

            <View style={[styles.gridItem, { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: colors.border, borderWidth: 0.5, borderRadius: radii.m }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.accentGold} />
              <View style={styles.itemTextWrapper}>
                <CustomText variant="caption" color={colors.textSecondary}>
                  SAFETY INDEX
                </CustomText>
                <CustomText variant="caption" weight="600" color="#FFFFFF">
                  92% Secure (Excellent)
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 3. AI Travel Tips */}
      <View style={[styles.section, { paddingHorizontal: spacing.xlarge, marginTop: spacing.large }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          PERSONALIZED SUGGESTIONS
        </CustomText>
        <CustomText variant="title" weight="600" color="#FFFFFF" style={styles.sectionTitle}>
          AI Explorer Advice
        </CustomText>

        {tips.map((tip, idx) => (
          <GlassCard key={`tip-${idx}`} style={[styles.tipCard, { marginBottom: spacing.small }]}>
            <Ionicons name="sparkles" size={16} color={colors.accentGold} style={styles.sparkleIcon} />
            <CustomText variant="caption" color="#FFFFFF" style={styles.tipText}>
              {tip}
            </CustomText>
          </GlassCard>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
  },
  grid: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemTextWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  tipCard: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sparkleIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
  },
});
