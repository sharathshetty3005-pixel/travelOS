import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import Animated, { FadeIn, Layout, SlideOutLeft } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { PackingItem } from '@/mocks/trips';
import { useTripStore } from '@/store/tripStore';

interface AIAssistantProps {
  tripId: string;
  destinationId: string;
}

interface AIRecommendItem {
  id: string;
  name: string;
  category: PackingItem['category'];
  priority: PackingItem['priority'];
  spaceWeight: number;
  reason: string;
}

const AI_SUGGESTIONS: Record<string, AIRecommendItem[]> = {
  'dest-amalfi': [
    { id: 'ai-amalfi-01', name: 'Microfiber Towel', category: 'Essentials', priority: 'medium', spaceWeight: 2, reason: 'Great for spontaneous cliff jumps and beach swims.' },
    { id: 'ai-amalfi-02', name: 'Windbreaker Jacket', category: 'Clothing', priority: 'high', spaceWeight: 3, reason: 'Strong ocean breezes expected during boat charters.' },
    { id: 'ai-amalfi-03', name: 'Dry Dry Bag', category: 'Accessories' as any, priority: 'low', spaceWeight: 3, reason: 'Protects cameras and phones from salt-spray sprays.' },
  ],
  'dest-kyoto': [
    { id: 'ai-kyoto-01', name: 'Slip-on Shoes', category: 'Clothing', priority: 'high', spaceWeight: 5, reason: 'Temples and teahouses require frequent shoe removals.' },
    { id: 'ai-kyoto-02', name: 'Compact Umbrella', category: 'Essentials', priority: 'medium', spaceWeight: 2, reason: 'Autumn afternoon walks show 45% drizzle risk.' },
    { id: 'ai-kyoto-03', name: 'Cash Coin Pouch', category: 'Essentials', priority: 'medium', spaceWeight: 1, reason: 'Shrine amulets and bus fares require exact coins.' },
  ],
};

const DEFAULT_SUGGESTIONS: AIRecommendItem[] = [
  { id: 'ai-def-01', name: 'Sleep Eye Mask', category: 'Essentials', priority: 'low', spaceWeight: 1, reason: 'Ensures solid rest during long flight transfers.' },
  { id: 'ai-def-02', name: 'USB-C Cable', category: 'Electronics', priority: 'high', spaceWeight: 2, reason: 'Universal battery backup links require cables.' },
];

export const AIAssistant = React.memo(function AIAssistant({
  tripId,
  destinationId,
}: AIAssistantProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();
  const addPackingItems = useTripStore((state) => state.addPackingItems);

  const baseRecommendations = AI_SUGGESTIONS[destinationId] || DEFAULT_SUGGESTIONS;
  const [suggestions, setSuggestions] = useState<AIRecommendItem[]>(baseRecommendations);

  if (suggestions.length === 0) return null;

  const handleAddSingle = (item: AIRecommendItem) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    
    const formattedItem: PackingItem = {
      id: `ai-pack-${Date.now()}-${item.id}`,
      name: item.name,
      category: item.category,
      packed: false,
      quantity: 1,
      priority: item.priority,
      spaceWeight: item.spaceWeight,
    };

    addPackingItems(tripId, [formattedItem]);
    setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  };

  const handleAcceptAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    const formattedItems: PackingItem[] = suggestions.map((s) => ({
      id: `ai-pack-${Date.now()}-${s.id}`,
      name: s.name,
      category: s.category,
      packed: false,
      quantity: 1,
      priority: s.priority,
      spaceWeight: s.spaceWeight,
    }));

    addPackingItems(tripId, formattedItems);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={14} color={colors.accentGold} />
          <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.titleText}>
            AI PACKING ASSISTANT
          </CustomText>
        </View>
        
        <Pressable onPress={handleAcceptAll}>
          <CustomText variant="caption" weight="700" color={colors.accentTeal}>
            ACCEPT ALL
          </CustomText>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { gap: spacing.small }]}
      >
        {suggestions.map((item) => (
          <Animated.View
            key={item.id}
            entering={FadeIn}
            exiting={SlideOutLeft}
            layout={Layout.springify()}
          >
            <GlassCard style={[styles.suggestCard, shadow.sm]}>
              <View style={styles.cardHeader}>
                <View style={styles.metaRow}>
                  <CustomText variant="caption" weight="700" color={colors.accentGold}>
                    {item.category.toUpperCase()}
                  </CustomText>
                  <CustomText variant="label" weight="600" color={colors.textPrimary} style={styles.itemName}>
                    {item.name}
                  </CustomText>
                </View>

                <Pressable
                  onPress={() => handleAddSingle(item)}
                  style={[styles.addBtn, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}
                >
                  <Ionicons name="add" size={14} color="#000000" />
                </Pressable>
              </View>

              <CustomText variant="caption" color={colors.textSecondary} numberOfLines={3} style={styles.reasonText}>
                {item.reason}
              </CustomText>
            </GlassCard>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 6,
    letterSpacing: 1.5,
  },
  scrollContainer: {
    paddingVertical: 4,
  },
  suggestCard: {
    width: 200,
    height: 110,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaRow: {
    flex: 1,
    marginRight: 6,
  },
  itemName: {
    marginTop: 2,
  },
  addBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonText: {
    lineHeight: 14,
    fontSize: 10,
  },
});
