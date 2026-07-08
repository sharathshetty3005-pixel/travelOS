import React from 'react';
import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';

interface ActionItem {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  { id: 'act-planner', label: 'AI Planner', subtitle: 'Build route', icon: 'sparkles-outline', route: '/planner' },
  { id: 'act-packing', label: 'Packing Check', subtitle: 'Check luggage', icon: 'briefcase-outline', route: '/packing' },
  { id: 'act-docs', label: 'Documents', subtitle: 'Secure ledger', icon: 'document-text-outline', route: '/documents' },
  { id: 'act-expenses', label: 'Expenses Ledger', subtitle: 'Track costs', icon: 'cash-outline', route: '/expenses' },
  { id: 'act-maps', label: 'Offline Maps', subtitle: 'Local paths', icon: 'map-outline', route: '/maps' },
  { id: 'act-currency', label: 'Rates Exchange', subtitle: 'Compare coin', icon: 'swap-horizontal-outline', route: '/currency' },
];

export const QuickActions = React.memo(function QuickActions() {
  const { spacing } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingHorizontal: spacing.xlarge, gap: spacing.small },
      ]}
    >
      {QUICK_ACTIONS.map((item) => (
        <ActionCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
});

// Redesigned action card using titles and subtitles
function ActionCard({ item }: { item: ActionItem }) {
  const { colors, radii, spacing, animation } = useAppTheme();
  const scale = useSharedValue(1);
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.94, animation.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, animation.spring.snappy);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // Perform navigation routing
    router.push(item.route as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.label}`}
    >
      <Animated.View style={animatedStyle}>
        <GlassCard style={styles.card}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: radii.s }]}>
              <Ionicons name={item.icon} size={18} color={colors.accentGold} />
            </View>
            <Ionicons name="chevron-forward" size={12} color={colors.textSecondary} />
          </View>
          
          <View style={styles.metaWrapper}>
            <CustomText variant="label" weight="600" color={colors.textPrimary}>
              {item.label}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary} style={styles.subText}>
              {item.subtitle}
            </CustomText>
          </View>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 4,
  },
  card: {
    width: 135,
    height: 105,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaWrapper: {
    width: '100%',
  },
  subText: {
    marginTop: 2,
  },
});
