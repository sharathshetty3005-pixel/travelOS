import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { Button } from '@/components/input/Button';
import { DestinationEntity } from '@/mocks/destinations';

interface StickyBottomBarProps {
  destination: DestinationEntity;
}

export const StickyBottomBar = React.memo(function StickyBottomBar({
  destination,
}: StickyBottomBarProps) {
  const { colors, spacing, radii } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSaved((prev) => !prev);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handlePlanTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push({
      pathname: '/planner',
      params: { destId: destination.id },
    });
  };

  // Cost estimates per destination
  const getEstimatedCost = (destId: string): string => {
    switch (destId) {
      case 'dest-amalfi':
        return '$2,450';
      case 'dest-kyoto':
        return '$1,850';
      case 'dest-reykjavik':
        return '$2,200';
      case 'dest-serengeti':
      default:
        return '$3,200';
    }
  };

  const cost = getEstimatedCost(destination.id);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          paddingHorizontal: spacing.xlarge,
        },
      ]}
    >
      <GlassCard style={styles.card}>
        {/* Left Column: Cost details */}
        <View style={styles.leftCol}>
          <CustomText variant="caption" color={colors.textSecondary}>
            ESTIMATED TRIP COST
          </CustomText>
          <View style={styles.priceRow}>
            <CustomText variant="title" weight="700" color={colors.textPrimary}>
              {cost}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary} style={styles.perPerson}>
              / person
            </CustomText>
          </View>
        </View>

        {/* Right Column: Interactive actions */}
        <View style={styles.rightCol}>
          <Pressable
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel={saved ? "Remove bookmark" : "Bookmark destination"}
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={16}
              color={saved ? colors.accentGold : colors.textPrimary}
            />
          </Pressable>

          <Pressable
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share destination"
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="share-social-outline" size={16} color={colors.textPrimary} />
          </Pressable>

          <View style={styles.btnWrapper}>
            <Button
              label="PLAN TRIP"
              onPress={handlePlanTrip}
              style={styles.planBtn}
            />
          </View>
        </View>
      </GlassCard>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  card: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
  },
  leftCol: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  perPerson: {
    marginLeft: 4,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  btnWrapper: {
    width: 125,
  },
  planBtn: {
    height: 36,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
});
